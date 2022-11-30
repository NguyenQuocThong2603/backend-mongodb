import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import ConnectRedis from 'connect-redis';

import createRouter from './src/routes/index.js';
import connectDB from './src/config/db.js';
import getConfig from './src/config/config.js';
import clientRedis from './src/config/redis.js';

dotenv.config();

const config = getConfig();
const port = config.PORT;

const app = express();

const RedisStore = ConnectRedis(session);

app.use(session({
  store: new RedisStore({ client: clientRedis }),
  secret: config.SECRET,
  saveUninitialized: false,
  cookie: { secure: false,
    httpOnly: true,
    maxAge: parseInt(config.EXPIRED_TIME, 10) },
  resave: false,
}));

app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(cookieParser());

app.use(morgan('dev'));
app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello');
});

if (process.env.NODE_ENV === 'testing') {
  connectDB(config.DATABASE_TEST_URL);
} else {
  connectDB(config.DATABASE_URL);
}

createRouter(app);
app.listen(port, console.log(`Server is starting at port ${port}`));

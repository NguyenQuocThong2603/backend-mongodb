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

const oneHour = 1000 * 60 * 60;
app.use(session({
  store: new RedisStore({ client: clientRedis }),
  secret: config.SECRET,
  saveUninitialized: true,
  cookie: { secure: false,
    httpOnly: true,
    maxAge: oneHour },
  resave: false,
}));

app.use(cookieParser());

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'testing') {
  connectDB(config.DATABASE_TEST_URL);
} else {
  connectDB(config.DATABASE_URL);
}

createRouter(app);
app.listen(port, console.log(`Server is starting at port ${port}`));

export default app;

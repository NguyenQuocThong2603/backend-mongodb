import userRouter from './user.route.js';
import urlRouter from './url.route.js';

function createRouter(app) {
  app.use('/users', userRouter);
  app.use('/urls', urlRouter);
}

export default createRouter;

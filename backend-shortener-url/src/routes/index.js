import authRouter from './auth.route.js';
import urlRouter from './url.route.js';
import adminRouter from './admin.route.js';

function createRouter(app) {
  app.use('/auth', authRouter);
  app.use('/urls', urlRouter);
  app.use('/admin', adminRouter);
}

export default createRouter;

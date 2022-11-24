import express from 'express';
import UrlController from '../controllers/url.controller.js';
import authenticated from '../middlewares/authenticated.mdw.js';
import cacheData from '../middlewares/cache.js';

const urlRouter = express.Router();

urlRouter.post('/', (req, res) => {
  UrlController.createUrl(req, res);
});

urlRouter.get('/statistic', authenticated, cacheData, (req, res) => {
  UrlController.statistic(req, res);
});

urlRouter.get('/:urlID', (req, res) => {
  UrlController.redirectUrl(req, res);
});

urlRouter.delete('/:urlID', authenticated, (req, res) => {
  UrlController.deleteUrl(req, res);
});

export default urlRouter;

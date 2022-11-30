import express from 'express';
import AdminController from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.delete('/disable-user/:username', async (req, res) => {
  AdminController.disableUser(req, res);
});

export default adminRouter;

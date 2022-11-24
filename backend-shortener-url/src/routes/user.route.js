import express from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  UserController.register(req, res);
});

userRouter.post('/login', (req, res) => {
  UserController.login(req, res);
});

export default userRouter;

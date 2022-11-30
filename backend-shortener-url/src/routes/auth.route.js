import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import passport from '../middlewares/passport.js';

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  AuthController.register(req, res);
});

authRouter.post('/login', (req, res) => {
  AuthController.login(req, res);
});

authRouter.delete('/logout', (req, res) => {
  AuthController.logout(req, res);
});

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

authRouter.get('/google/callback', passport.authenticate('google', { session: true }), (req, res) => {
  const { user } = req;
  res.json({ message: 'Login successfully', user });
});

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  const { user } = req;
  res.json({ message: 'Login successfully', user });
});

export default authRouter;

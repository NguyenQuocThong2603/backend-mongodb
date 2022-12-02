import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import passport from '../middlewares/passport.mdw.js';

const authRouter = express.Router();

authRouter.post('/reset-password/:code', (req, res) => {
  AuthController.resetPassword(req, res);
});

authRouter.post('/send-mail-resetpassword', (req, res) => {
  AuthController.sendMailResetPassword(req, res);
});

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
  AuthController.googleLogin(req, res);
});

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  AuthController.facebookLogin(req, res);
});

export default authRouter;

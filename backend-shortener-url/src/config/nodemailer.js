import nodemailer from 'nodemailer';
import getConfig from './config.js';
import contentOfResetPasswordEmail from '../constants/contentOfResetPasswordEmail.js';

const config = getConfig();

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: config.SHORTENER_URL_MAIL,
    pass: config.SHORTENER_URL_PASSWORD,
  },
});

function sendResetPasswordEmail(email, resetCode) {
  const html = contentOfResetPasswordEmail(resetCode);
  transport.sendMail({
    from: config.SHORTENER_URL_MAIL,
    to: email,
    subject: 'Reset password',
    html,
  }).catch(err => console.log(err));
}

export default sendResetPasswordEmail;

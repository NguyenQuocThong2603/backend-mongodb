import statusCode from '../constants/statusCode.js';

function authenticated(req, res, next) {
  if (req.session.user === undefined) {
    return res.status(statusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
  }
  next();
}

export default authenticated;

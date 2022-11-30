import GooglePassport from 'passport-google-oauth20';
import FacebookPassport from 'passport-facebook';
import passport from 'passport';
import getConfig from '../config/config.js';
import User from '../models/user.model.js';

const config = getConfig();

const GoogleStrategy = GooglePassport.Strategy;

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({
      email: profile.emails[0].value,
    });
    if (user) {
      return cb(null, user);
    }

    const newUser = new User({
      email: profile.emails[0].value,
      fullName: `${profile.name.familyName} ${profile.name.givenName}`,
    });
    await newUser.save();
    return cb(null, newUser);
  } catch (err) {
    return cb(err, false);
  }
}));

const FacebookStrategy = FacebookPassport.Strategy;

passport.use(new FacebookStrategy({
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['email', 'name'],
}, async (accessToken, refreshToken, profile, done) => {
  const { email } = profile._json;
  try {
    const user = await User.findOne({
      email,
    });
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      email,
      fullName: `${profile.name.familyName} ${profile.name.givenName}`,
    });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;

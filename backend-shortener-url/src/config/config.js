import * as dotenv from 'dotenv';

dotenv.config();
function getConfig() {
  const config = {
    MODE: 'Development',
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.MONGODB_URL,
    DATABASE_TEST_URL: process.env.TEST_MONGODB_URL,
    SECRET: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    EXPIRED_TIME: process.env.EXPIRED_TIME,
    EXPIRED_TIME_RESET_EMAIL: process.env.EXPIRED_TIME_RESET_EMAIL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    SHORTENER_URL_MAIL: process.env.SHORTENER_URL_MAIL,
    SHORTENER_URL_PASSWORD: process.env.SHORTENER_URL_PASSWORD,
  };
  return config;
}

export default getConfig;

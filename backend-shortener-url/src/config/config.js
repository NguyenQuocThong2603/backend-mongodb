import * as dotenv from 'dotenv';

dotenv.config();
function getConfig() {
  const config = {
    MODE: 'Development',
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.MONGODB_URL,
    DATABASE_TEST_URL: process.env.TEST_MONGODB_URL,
    SECRET: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
  };
  return config;
}

export default getConfig;

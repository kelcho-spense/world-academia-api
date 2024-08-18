
import IConfig from './IConfig'
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV as string;

const config: IConfig = {
  development: {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGO_URI as string
  },
  production: {
    port: Number(process.env.PORT),
    mongoUri: process.env.COSMOS_URI as string,
  }
};

export default config[env as keyof IConfig];
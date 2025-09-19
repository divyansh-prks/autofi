import dotenv from 'dotenv';
import { COOKIE_NAME } from '../utils/jwt';
dotenv.config();
const config = {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT,
   COOKIE_NAME:process.env.COOKIE_NAME,
   JWT_SECRET:process.env.JWT_SECRET
  };
  
  export default config;
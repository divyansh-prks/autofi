import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import config from '../config/config';

dotenv.config();



const JWT_SECRET = config.JWT_SECRET || 'secret';
const COOKIE_NAME = config.COOKIE_NAME || 'yt_agent_token';


export function signToken(payload: object, expiresIn:string | number = '7d') {
    const option:SignOptions = {expiresIn :  expiresIn as any}
return jwt.sign(payload, JWT_SECRET, option);
}


export function verifyToken(token: string) {
try {
return jwt.verify(token, JWT_SECRET) as any;
} catch (err) {
return null;
}
}


export { COOKIE_NAME };
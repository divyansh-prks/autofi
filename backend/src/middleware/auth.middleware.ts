import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import config from '../config/config';

export interface AuthRequest extends Request {
userId?: string;
}


export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
const token = req.cookies?.[config.COOKIE_NAME || 'yt_agent_token'];
if (!token) return res.status(401).json({ error: 'Not authenticated' });


const payload = verifyToken(token);
if (!payload) return res.status(401).json({ error: 'Invalid token' });


req.userId = (payload as any).userId;
next();
};
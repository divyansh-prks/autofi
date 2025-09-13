import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME } from '../utils/jwt';
import config from '../config/config';

const prisma = new PrismaClient();


export const register = async (req: Request, res: Response) => {
const { email, password, name } = req.body;
if (!email || !password) return res.status(400).json({ error: 'email and password required' });


try {
const existing = await prisma.user.findUnique({ where: { email } });
if (existing) return res.status(409).json({ error: 'User already exists' });


const hashed = await bcrypt.hash(password, 10);
const user = await prisma.user.create({ data: { email, password: hashed, name } });


const token = signToken({ userId: user.id });
res.cookie(COOKIE_NAME, token, {
httpOnly: true,
sameSite: 'lax',
secure: config.NODE_ENV === 'production',
maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


const { password: _p, ...safe } = user as any;
return res.status(201).json({ user: safe });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Internal server error' });
}
};


export const login = async (req: Request, res: Response) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ error: 'email and password required' });


try {
const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });


const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ error: 'Invalid credentials' });


const token = signToken({ userId: user.id });
res.cookie(COOKIE_NAME, token, {
httpOnly: true,
sameSite: 'lax',
secure: config.NODE_ENV === 'production',
maxAge: 7 * 24 * 60 * 60 * 1000,
});


const { password: _p, ...safe } = user as any;
return res.json({ user: safe });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Internal server error' });
}
};


export const logout = async (_req: Request, res: Response) => {
res.clearCookie(COOKIE_NAME, {
httpOnly: true,
sameSite: 'lax',
secure: config.NODE_ENV === 'production',
});
return res.json({ ok: true });
};
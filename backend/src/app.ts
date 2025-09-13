import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { requireAuth, AuthRequest } from './middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';


dotenv.config();
const prisma = new PrismaClient();


const app = express();
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';


app.use(express.json());
app.use(cookieParser());
app.use(
cors({
origin: FRONTEND,
credentials: true,
})
);


app.get('/', (_req, res) => res.json({ message: 'YouTube-AI-Agent backend is running' }));


app.use('/auth', authRoutes);


app.get('/me', requireAuth, async (req: AuthRequest, res) => {
try {
const user = await prisma.user.findUnique({ where: { id: req.userId } });
if (!user) return res.status(404).json({ error: 'User not found' });
const { password: _p, ...safe } = user as any;
return res.json({ user: safe });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Internal server error' });
}
});


export default app;
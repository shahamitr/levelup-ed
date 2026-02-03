
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                username
            }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email, xp: user.xp, level: user.level } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Gamification Logic: Streaks & Login Bonus
        const today = new Date();
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        let streak = user.streak;
        let streakFreezeCount = user.streakFreezeCount;
        let gems = user.gems;
        let loginMessage = 'Welcome back!';

        if (!lastLogin) {
            streak = 1;
            gems += 10; // First login bonus
            loginMessage = 'First login! +10 Gems';
        } else {
            const isSameDay = today.toDateString() === lastLogin.toDateString();

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const isYesterday = yesterday.toDateString() === lastLogin.toDateString();

            if (!isSameDay) {
                if (isYesterday) {
                    streak += 1;
                    gems += 10;
                    loginMessage = `Streak continued! ${streak} days! +10 Gems`;
                } else {
                    // Missed a day or more
                    if (streakFreezeCount > 0) {
                        streakFreezeCount -= 1;
                        loginMessage = 'Streak Saved by Freeze! 🧊';
                        // Streak preserved
                    } else {
                        streak = 1;
                        gems += 10; // Start new streak
                        loginMessage = 'Streak lost! Starting over. +10 Gems';
                    }
                }
            }
        }

        // Update User
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: today,
                streak,
                streakFreezeCount,
                gems
            }
        });

        res.json({
            token,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                xp: updatedUser.xp,
                level: updatedUser.level,
                focusScore: updatedUser.focusScore,
                streak: updatedUser.streak,
                gems: updatedUser.gems,
                freezeCount: updatedUser.streakFreezeCount
            },
            message: loginMessage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

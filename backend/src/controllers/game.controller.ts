
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorlds = async (req: Request, res: Response) => {
    try {
        const worlds = await prisma.world.findMany({
            include: { topics: true }
        });
        res.json(worlds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching worlds' });
    }
};

export const saveProgress = async (req: Request, res: Response) => {
    const { userId, worldId, level, xpGained } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpGained },
                // Simple level logic: 1000 XP per level
                level: { set: Math.floor((await prisma.user.findUniqueOrThrow({ where: { id: userId } })).xp / 1000) + 1 }
            }
        });

        // Note: In a real app we would update a "UserWorldProgress" table.
        // For now we just update User stats.

        res.json({ user, message: 'Progress saved' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress' });
    }
};

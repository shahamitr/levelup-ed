import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Heart regeneration interval (in minutes)
const HEART_REGEN_INTERVAL = 30;

// Get user hearts status
export const getHearts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { hearts: true, maxHearts: true, lastHeartRegen: true }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for heart regeneration
        const regenerated = await regenerateHearts(userId, user);

        res.json({
            hearts: regenerated.hearts,
            maxHearts: regenerated.maxHearts,
            nextRegenIn: getTimeToNextRegen(regenerated.lastHeartRegen)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get hearts' });
    }
};

// Deduct a heart (on wrong answer)
export const useHeart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { hearts: true, maxHearts: true }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.hearts <= 0) {
            return res.status(400).json({
                message: 'No hearts left!',
                canContinue: false,
                hearts: 0
            });
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { hearts: { decrement: 1 } },
            select: { hearts: true, maxHearts: true }
        });

        res.json({
            hearts: updated.hearts,
            maxHearts: updated.maxHearts,
            canContinue: updated.hearts > 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to use heart' });
    }
};

// Buy hearts with gems
export const buyHearts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { amount } = req.body; // Number of hearts to buy

        const heartsToBuy = Math.min(amount || 1, 5);
        const gemCost = heartsToBuy * 50; // 50 gems per heart

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { gems: true, hearts: true, maxHearts: true }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.gems < gemCost) {
            return res.status(400).json({ message: 'Not enough gems' });
        }

        const newHearts = Math.min(user.hearts + heartsToBuy, user.maxHearts);

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                gems: { decrement: gemCost },
                hearts: newHearts
            },
            select: { gems: true, hearts: true, maxHearts: true }
        });

        res.json({
            message: `Bought ${heartsToBuy} hearts!`,
            gems: updated.gems,
            hearts: updated.hearts
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to buy hearts' });
    }
};

// Refill all hearts (premium/daily bonus)
export const refillHearts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                hearts: { set: prisma.user.fields.maxHearts }
            },
            select: { hearts: true, maxHearts: true }
        });

        // Workaround: Fetch maxHearts and set hearts equal to it
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { maxHearts: true }
        });

        await prisma.user.update({
            where: { id: userId },
            data: { hearts: user?.maxHearts || 5 }
        });

        res.json({
            message: 'Hearts refilled!',
            hearts: user?.maxHearts || 5,
            maxHearts: user?.maxHearts || 5
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to refill hearts' });
    }
};

// Helper: Regenerate hearts based on time
async function regenerateHearts(userId: string, user: { hearts: number; maxHearts: number; lastHeartRegen: Date }) {
    const now = new Date();
    const lastRegen = new Date(user.lastHeartRegen);
    const minutesSinceRegen = (now.getTime() - lastRegen.getTime()) / (1000 * 60);

    const heartsToRegen = Math.floor(minutesSinceRegen / HEART_REGEN_INTERVAL);

    if (heartsToRegen > 0 && user.hearts < user.maxHearts) {
        const newHearts = Math.min(user.hearts + heartsToRegen, user.maxHearts);

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                hearts: newHearts,
                lastHeartRegen: new Date(lastRegen.getTime() + (heartsToRegen * HEART_REGEN_INTERVAL * 60 * 1000))
            },
            select: { hearts: true, maxHearts: true, lastHeartRegen: true }
        });

        return updated;
    }

    return user;
}

// Helper: Get time until next heart regeneration
function getTimeToNextRegen(lastRegen: Date): number {
    const now = new Date();
    const lastRegenTime = new Date(lastRegen);
    const nextRegenTime = new Date(lastRegenTime.getTime() + (HEART_REGEN_INTERVAL * 60 * 1000));
    const msRemaining = Math.max(0, nextRegenTime.getTime() - now.getTime());
    return Math.ceil(msRemaining / 1000); // seconds remaining
}

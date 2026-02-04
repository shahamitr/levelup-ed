import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Send PvP challenge to a friend
export const sendChallenge = async (req: Request, res: Response) => {
    try {
        const senderId = (req as any).userId;
        const { receiverId, topic, worldId } = req.body;

        if (!receiverId || !topic) {
            return res.status(400).json({ message: 'Receiver and topic required' });
        }

        // Check if they are friends
        const friendship = await prisma.friendship.findFirst({
            where: {
                status: 'accepted',
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        });

        if (!friendship) {
            return res.status(400).json({ message: 'You can only challenge friends' });
        }

        const challenge = await prisma.challenge.create({
            data: {
                senderId,
                receiverId,
                topic,
                worldId: worldId || null
            },
            include: {
                sender: { select: { username: true, level: true } },
                receiver: { select: { username: true, level: true } }
            }
        });

        res.status(201).json({ message: 'Challenge sent!', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send challenge' });
    }
};

// Respond to challenge (accept/decline)
export const respondToChallenge = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { challengeId, accept } = req.body;

        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId }
        });

        if (!challenge || challenge.receiverId !== userId) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        if (challenge.status !== 'pending') {
            return res.status(400).json({ message: 'Challenge already responded to' });
        }

        const updated = await prisma.challenge.update({
            where: { id: challengeId },
            data: {
                status: accept ? 'accepted' : 'declined',
                startedAt: accept ? new Date() : null
            }
        });

        res.json({ message: accept ? 'Challenge accepted!' : 'Challenge declined', challenge: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to respond to challenge' });
    }
};

// Submit challenge results
export const submitChallengeResult = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { challengeId, score } = req.body;

        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId }
        });

        if (!challenge || challenge.status !== 'accepted') {
            return res.status(404).json({ message: 'Active challenge not found' });
        }

        const isSender = challenge.senderId === userId;
        const isReceiver = challenge.receiverId === userId;

        if (!isSender && !isReceiver) {
            return res.status(403).json({ message: 'Not your challenge' });
        }

        // Update the appropriate score
        const updateData: any = isSender
            ? { senderScore: score }
            : { receiverScore: score };

        // Get updated challenge to check if both submitted
        const updated = await prisma.challenge.update({
            where: { id: challengeId },
            data: updateData
        });

        // If both scores are in, determine winner
        if (updated.senderScore !== null && updated.receiverScore !== null) {
            const winnerId = updated.senderScore > updated.receiverScore
                ? updated.senderId
                : updated.receiverScore > updated.senderScore
                    ? updated.receiverId
                    : null; // tie

            const completed = await prisma.challenge.update({
                where: { id: challengeId },
                data: {
                    status: 'completed',
                    winnerId,
                    completedAt: new Date()
                }
            });

            // Award XP and gems to winner
            if (winnerId) {
                await prisma.user.update({
                    where: { id: winnerId },
                    data: {
                        xp: { increment: completed.xpReward },
                        gems: { increment: completed.gemReward }
                    }
                });
            }

            return res.json({
                message: winnerId ? 'Challenge completed!' : 'It\'s a tie!',
                challenge: completed,
                winner: winnerId
            });
        }

        res.json({ message: 'Score submitted, waiting for opponent', challenge: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit result' });
    }
};

// Get user's challenges
export const getChallenges = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { status } = req.query;

        const where: any = {
            OR: [{ senderId: userId }, { receiverId: userId }]
        };

        if (status) {
            where.status = status;
        }

        const challenges = await prisma.challenge.findMany({
            where,
            include: {
                sender: { select: { id: true, username: true, level: true } },
                receiver: { select: { id: true, username: true, level: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ challenges });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get challenges' });
    }
};

// Get challenge by ID
export const getChallenge = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const challenge = await prisma.challenge.findUnique({
            where: { id },
            include: {
                sender: { select: { id: true, username: true, level: true } },
                receiver: { select: { id: true, username: true, level: true } }
            }
        });

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        res.json({ challenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

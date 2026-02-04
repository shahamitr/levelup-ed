import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Send friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        const senderId = (req as any).userId;
        const { receiverId } = req.body;

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        // Check if friendship already exists
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        });

        if (existing) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friendship = await prisma.friendship.create({
            data: { senderId, receiverId }
        });

        res.status(201).json({ message: 'Friend request sent', friendship });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send friend request' });
    }
};

// Accept or decline friend request
export const respondToFriendRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { friendshipId, accept } = req.body;

        const friendship = await prisma.friendship.findUnique({
            where: { id: friendshipId }
        });

        if (!friendship || friendship.receiverId !== userId) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        const updated = await prisma.friendship.update({
            where: { id: friendshipId },
            data: { status: accept ? 'accepted' : 'declined' }
        });

        res.json({ message: accept ? 'Friend added!' : 'Request declined', friendship: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to respond to request' });
    }
};

// Get friends list
export const getFriends = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const friendships = await prisma.friendship.findMany({
            where: {
                status: 'accepted',
                OR: [{ senderId: userId }, { receiverId: userId }]
            },
            include: {
                sender: { select: { id: true, username: true, level: true, xp: true } },
                receiver: { select: { id: true, username: true, level: true, xp: true } }
            }
        });

        const friends = friendships.map(f =>
            f.senderId === userId ? f.receiver : f.sender
        );

        res.json({ friends });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get friends' });
    }
};

// Get pending friend requests
export const getPendingRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const pending = await prisma.friendship.findMany({
            where: {
                receiverId: userId,
                status: 'pending'
            },
            include: {
                sender: { select: { id: true, username: true, level: true } }
            }
        });

        res.json({ pendingRequests: pending });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get pending requests' });
    }
};

// Search users to add as friends
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Search query required' });
        }

        const users = await prisma.user.findMany({
            where: {
                id: { not: userId },
                username: { contains: query, mode: 'insensitive' }
            },
            select: { id: true, username: true, level: true, xp: true },
            take: 10
        });

        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Search failed' });
    }
};

// Remove friend
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { friendId } = req.params;

        await prisma.friendship.deleteMany({
            where: {
                status: 'accepted',
                OR: [
                    { senderId: userId, receiverId: friendId },
                    { senderId: friendId, receiverId: userId }
                ]
            }
        });

        res.json({ message: 'Friend removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove friend' });
    }
};

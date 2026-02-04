import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create study group
export const createStudyGroup = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).userId;
        const { name, description, topic, maxMembers, isPublic } = req.body;

        if (!name || !topic) {
            return res.status(400).json({ message: 'Name and topic required' });
        }

        const group = await prisma.studyGroup.create({
            data: {
                name,
                description: description || null,
                topic,
                ownerId,
                maxMembers: maxMembers || 10,
                isPublic: isPublic !== false,
                members: {
                    create: { userId: ownerId, role: 'owner' }
                }
            },
            include: { members: { include: { user: { select: { username: true } } } } }
        });

        res.status(201).json({ message: 'Study group created!', group });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create study group' });
    }
};

// Get all public study groups
export const getStudyGroups = async (req: Request, res: Response) => {
    try {
        const { topic } = req.query;

        const where: any = { isPublic: true };
        if (topic) where.topic = { contains: topic as string, mode: 'insensitive' };

        const groups = await prisma.studyGroup.findMany({
            where,
            include: {
                owner: { select: { username: true } },
                _count: { select: { members: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ groups });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get study groups' });
    }
};

// Get single study group with members
export const getStudyGroup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const group = await prisma.studyGroup.findUnique({
            where: { id },
            include: {
                owner: { select: { id: true, username: true, level: true } },
                members: {
                    include: { user: { select: { id: true, username: true, level: true } } }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            }
        });

        if (!group) {
            return res.status(404).json({ message: 'Study group not found' });
        }

        res.json({ group });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Join study group
export const joinStudyGroup = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { groupId } = req.body;

        const group = await prisma.studyGroup.findUnique({
            where: { id: groupId },
            include: { _count: { select: { members: true } } }
        });

        if (!group) {
            return res.status(404).json({ message: 'Study group not found' });
        }

        if (group._count.members >= group.maxMembers) {
            return res.status(400).json({ message: 'Group is full' });
        }

        // Check if already a member
        const existing = await prisma.studyGroupMember.findUnique({
            where: { groupId_userId: { groupId, userId } }
        });

        if (existing) {
            return res.status(400).json({ message: 'Already a member' });
        }

        await prisma.studyGroupMember.create({
            data: { groupId, userId }
        });

        res.json({ message: 'Joined study group!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join group' });
    }
};

// Leave study group
export const leaveStudyGroup = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { groupId } = req.params;

        const membership = await prisma.studyGroupMember.findUnique({
            where: { groupId_userId: { groupId, userId } }
        });

        if (!membership) {
            return res.status(404).json({ message: 'Not a member' });
        }

        if (membership.role === 'owner') {
            return res.status(400).json({ message: 'Owner cannot leave. Transfer ownership or delete group.' });
        }

        await prisma.studyGroupMember.delete({
            where: { groupId_userId: { groupId, userId } }
        });

        res.json({ message: 'Left study group' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to leave group' });
    }
};

// Send message to study group
export const sendGroupMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { groupId, content } = req.body;

        // Check membership
        const membership = await prisma.studyGroupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
            include: { user: { select: { username: true } } }
        });

        if (!membership) {
            return res.status(403).json({ message: 'Not a member of this group' });
        }

        const message = await prisma.groupMessage.create({
            data: {
                groupId,
                userId,
                username: membership.user.username,
                content
            }
        });

        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// Get user's study groups
export const getMyStudyGroups = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const memberships = await prisma.studyGroupMember.findMany({
            where: { userId },
            include: {
                group: {
                    include: {
                        owner: { select: { username: true } },
                        _count: { select: { members: true } }
                    }
                }
            }
        });

        const groups = memberships.map(m => ({
            ...m.group,
            myRole: m.role
        }));

        res.json({ groups });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get your groups' });
    }
};

// Delete study group (owner only)
export const deleteStudyGroup = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { id } = req.params;

        const group = await prisma.studyGroup.findUnique({ where: { id } });

        if (!group || group.ownerId !== userId) {
            return res.status(403).json({ message: 'Only owner can delete group' });
        }

        // Delete messages, members, then group
        await prisma.groupMessage.deleteMany({ where: { groupId: id } });
        await prisma.studyGroupMember.deleteMany({ where: { groupId: id } });
        await prisma.studyGroup.delete({ where: { id } });

        res.json({ message: 'Study group deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete group' });
    }
};

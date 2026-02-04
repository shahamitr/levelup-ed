import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active partners
export const getPartners = async (req: Request, res: Response) => {
    try {
        const partners = await prisma.partner.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });

        res.json({ partners });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single partner with their worlds
export const getPartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const partner = await prisma.partner.findUnique({
            where: { id },
            include: {
                worlds: {
                    include: { world: true }
                }
            }
        });

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        res.json({ partner });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new partner (admin only)
export const createPartner = async (req: Request, res: Response) => {
    try {
        const { name, shortName, logoUrl, website, tier } = req.body;

        if (!name || !shortName || !logoUrl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const partner = await prisma.partner.create({
            data: {
                name,
                shortName,
                logoUrl,
                website: website || null,
                tier: tier || 'standard'
            }
        });

        res.status(201).json({ partner });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create partner' });
    }
};

// Update partner (admin only)
export const updatePartner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, shortName, logoUrl, website, tier, isActive } = req.body;

        const partner = await prisma.partner.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(shortName && { shortName }),
                ...(logoUrl && { logoUrl }),
                ...(website !== undefined && { website }),
                ...(tier && { tier }),
                ...(isActive !== undefined && { isActive })
            }
        });

        res.json({ partner });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update partner' });
    }
};

// Link partner to world
export const linkPartnerToWorld = async (req: Request, res: Response) => {
    try {
        const { partnerId, worldId, isPrimary } = req.body;

        // If setting as primary, unset other primaries for this world
        if (isPrimary) {
            await prisma.worldPartner.updateMany({
                where: { worldId },
                data: { isPrimary: false }
            });
        }

        const worldPartner = await prisma.worldPartner.upsert({
            where: {
                worldId_partnerId: { worldId, partnerId }
            },
            update: { isPrimary: isPrimary || false },
            create: {
                worldId,
                partnerId,
                isPrimary: isPrimary || false
            }
        });

        res.json({ worldPartner });
    } catch (error) {
        res.status(500).json({ message: 'Failed to link partner' });
    }
};

// Get worlds by partner
export const getPartnerWorlds = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const worldPartners = await prisma.worldPartner.findMany({
            where: { partnerId: id },
            include: { world: true }
        });

        const worlds = worldPartners.map(wp => ({
            ...wp.world,
            isPrimary: wp.isPrimary
        }));

        res.json({ worlds });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

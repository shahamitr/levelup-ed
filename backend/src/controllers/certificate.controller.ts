import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Generate unique certificate number
const generateCertificateNumber = (): string => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `LUE-${year}-${random}`;
};

// Generate verification hash
const generateVerificationHash = (certId: string, userId: string): string => {
  return crypto
    .createHash('sha256')
    .update(`${certId}-${userId}-${Date.now()}`)
    .digest('hex')
    .substring(0, 32);
};

// Generate certificate for completed world
export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { worldId, skills } = req.body;

    if (!worldId) {
      return res.status(400).json({ message: 'World ID is required' });
    }

    // Get user and world data
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const world = await prisma.world.findUnique({
      where: { id: worldId },
      include: {
        partners: {
          include: { partner: true },
          where: { isPrimary: true }
        }
      }
    });

    if (!user || !world) {
      return res.status(404).json({ message: 'User or World not found' });
    }

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: { userId, worldId }
    });

    if (existingCert) {
      return res.status(400).json({
        message: 'Certificate already issued',
        certificate: existingCert
      });
    }

    const certId = generateCertificateNumber();
    const verificationHash = generateVerificationHash(certId, userId);
    const primaryPartner = world.partners[0]?.partner || null;

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        worldId,
        partnerId: primaryPartner?.id || null,
        certificateNumber: certId,
        verificationHash,
        recipientName: user.username,
        courseName: world.name,
        skillsVerified: skills || ['General Proficiency'],
        finalScore: null,
        hoursSpent: null
      },
      include: {
        world: true,
        partner: true
      }
    });

    res.json({
      message: 'Certificate generated successfully',
      certificate: {
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        recipientName: certificate.recipientName,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        verificationUrl: `/api/certificates/verify/${certificate.verificationHash}`,
        skills: certificate.skillsVerified,
        partner: primaryPartner ? {
          name: primaryPartner.name,
          logoUrl: primaryPartner.logoUrl
        } : null
      }
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ message: 'Failed to generate certificate' });
  }
};

// Get certificate by ID
export const getCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        world: true,
        partner: true,
        user: { select: { username: true, email: true } }
      }
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ certificate });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Public verification endpoint (for QR codes)
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { verificationHash: hash },
      include: {
        world: true,
        partner: true
      }
    });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: 'Certificate not found or invalid'
      });
    }

    if (certificate.status === 'revoked') {
      return res.json({
        valid: false,
        message: 'Certificate has been revoked',
        certificate: {
          certificateNumber: certificate.certificateNumber,
          status: 'revoked'
        }
      });
    }

    res.json({
      valid: true,
      message: 'Certificate is valid',
      certificate: {
        certificateNumber: certificate.certificateNumber,
        recipientName: certificate.recipientName,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        skills: certificate.skillsVerified,
        partner: certificate.partner ? {
          name: certificate.partner.name,
          logoUrl: certificate.partner.logoUrl
        } : null,
        status: certificate.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
};

// Get all certificates for a user
export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: {
        world: true,
        partner: true
      },
      orderBy: { issueDate: 'desc' }
    });

    res.json({ certificates });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate certificate data for PDF (frontend will render)
export const getCertificatePdfData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        world: true,
        partner: true,
        user: { select: { username: true } }
      }
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Return data formatted for PDF generation
    res.json({
      templateData: {
        recipientName: certificate.recipientName,
        courseName: certificate.courseName,
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        skills: certificate.skillsVerified,
        partnerName: certificate.partner?.name || null,
        partnerLogo: certificate.partner?.logoUrl || null,
        verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificate.verificationHash}`,
        qrData: certificate.verificationHash
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

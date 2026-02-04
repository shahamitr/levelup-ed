import { Router } from 'express';
import {
    generateCertificate,
    getCertificate,
    verifyCertificate,
    getUserCertificates,
    getCertificatePdfData
} from '../controllers/certificate.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public route - QR verification
router.get('/verify/:hash', verifyCertificate);

// Protected routes
router.post('/generate', authMiddleware, generateCertificate);
router.get('/my', authMiddleware, getUserCertificates);
router.get('/:id', authMiddleware, getCertificate);
router.get('/:id/pdf', authMiddleware, getCertificatePdfData);

export default router;

import { Router } from 'express';
import {
    getPartners,
    getPartner,
    createPartner,
    updatePartner,
    linkPartnerToWorld,
    getPartnerWorlds
} from '../controllers/partner.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPartners);
router.get('/:id', getPartner);
router.get('/:id/worlds', getPartnerWorlds);

// Protected routes (admin)
router.post('/', authMiddleware, createPartner);
router.put('/:id', authMiddleware, updatePartner);
router.post('/link-world', authMiddleware, linkPartnerToWorld);

export default router;

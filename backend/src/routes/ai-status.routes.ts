// AI Status and Monitoring Routes

import { Router } from 'express';
import {
    getAIStatus,
    getQuotaAlerts,
    acknowledgeAlert,
    getUsageStats
} from '../controllers/ai-status.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public status endpoint (for frontend graceful degradation)
router.get('/status', getAIStatus);

// Protected admin endpoints
router.get('/alerts', authMiddleware, getQuotaAlerts);
router.post('/alerts/acknowledge', authMiddleware, acknowledgeAlert);
router.get('/usage', authMiddleware, getUsageStats);

export default router;

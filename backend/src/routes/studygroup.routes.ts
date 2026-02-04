import { Router } from 'express';
import {
    createStudyGroup,
    getStudyGroups,
    getStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    sendGroupMessage,
    getMyStudyGroups,
    deleteStudyGroup
} from '../controllers/studygroup.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getStudyGroups);
router.get('/:id', getStudyGroup);

// Protected routes
router.post('/', authMiddleware, createStudyGroup);
router.post('/join', authMiddleware, joinStudyGroup);
router.delete('/:groupId/leave', authMiddleware, leaveStudyGroup);
router.post('/message', authMiddleware, sendGroupMessage);
router.get('/my/groups', authMiddleware, getMyStudyGroups);
router.delete('/:id', authMiddleware, deleteStudyGroup);

export default router;

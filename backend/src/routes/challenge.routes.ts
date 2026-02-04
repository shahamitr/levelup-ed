import { Router } from 'express';
import {
    sendChallenge,
    respondToChallenge,
    submitChallengeResult,
    getChallenges,
    getChallenge
} from '../controllers/challenge.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.post('/send', sendChallenge);
router.post('/respond', respondToChallenge);
router.post('/submit', submitChallengeResult);
router.get('/', getChallenges);
router.get('/:id', getChallenge);

export default router;

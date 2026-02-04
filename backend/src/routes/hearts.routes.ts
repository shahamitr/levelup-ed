import { Router } from 'express';
import {
    getHearts,
    useHeart,
    buyHearts,
    refillHearts
} from '../controllers/hearts.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getHearts);
router.post('/use', useHeart);
router.post('/buy', buyHearts);
router.post('/refill', refillHearts);

export default router;

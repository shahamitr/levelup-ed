
import { Router } from 'express';
import { getWorlds, saveProgress } from '../controllers/game.controller';

const router = Router();

router.get('/worlds', getWorlds);
router.post('/progress', saveProgress);

export default router;

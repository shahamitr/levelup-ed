
import { Router } from 'express';
import { chatWithMentor } from '../controllers/ai.controller';

const router = Router();

router.post('/chat', chatWithMentor);

export default router;


import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate, loginSchema, registerSchema } from '../middleware/validation';
import { slowDown } from '../middleware/rateLimit';

const router = Router();

// Slow down repeated login attempts (progressive delay)
const loginSlowDown = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 3,            // Start delaying after 3 attempts
    delayMs: 500              // Add 500ms delay per attempt
});

// POST /api/auth/register
router.post(
    '/register',
    validate(registerSchema),
    register
);

// POST /api/auth/login
router.post(
    '/login',
    loginSlowDown,
    validate(loginSchema),
    login
);

export default router;

import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// CSRF token store (in production, use Redis or session store)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Token expiry: 1 hour
const TOKEN_EXPIRY = 60 * 60 * 1000;

// Clean expired tokens periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of csrfTokens.entries()) {
        if (value.expires < now) {
            csrfTokens.delete(key);
        }
    }
}, 60 * 1000); // Clean every minute

// Generate CSRF token
export const generateCsrfToken = (sessionId: string): string => {
    const token = crypto.randomBytes(32).toString('hex');
    csrfTokens.set(sessionId, {
        token,
        expires: Date.now() + TOKEN_EXPIRY
    });
    return token;
};

// Validate CSRF token
const isValidCsrfToken = (sessionId: string, token: string): boolean => {
    const stored = csrfTokens.get(sessionId);
    if (!stored) return false;
    if (stored.expires < Date.now()) {
        csrfTokens.delete(sessionId);
        return false;
    }
    return crypto.timingSafeEqual(
        Buffer.from(stored.token),
        Buffer.from(token)
    );
};

// CSRF middleware
export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Get session ID from JWT or create temporary one
    const sessionId = (req as any).userId || req.ip || 'anonymous';

    // Check for token in header or body
    const token = req.headers['x-csrf-token'] as string || req.body?._csrf;

    if (!token) {
        return res.status(403).json({
            message: 'CSRF token missing',
            code: 'CSRF_MISSING'
        });
    }

    if (!isValidCsrfToken(sessionId, token)) {
        return res.status(403).json({
            message: 'Invalid CSRF token',
            code: 'CSRF_INVALID'
        });
    }

    next();
};

// Endpoint to get CSRF token
export const getCsrfToken = (req: Request, res: Response) => {
    const sessionId = (req as any).userId || req.ip || 'anonymous';
    const token = generateCsrfToken(sessionId);

    res.json({
        csrfToken: token,
        expiresIn: TOKEN_EXPIRY / 1000 // seconds
    });
};

// Cookie-based double submit pattern (alternative)
export const csrfCookieMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        // Set CSRF cookie on safe requests
        const token = crypto.randomBytes(32).toString('hex');
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false, // Must be readable by JS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: TOKEN_EXPIRY
        });
        return next();
    }

    // Verify double submit
    const cookieToken = req.cookies?.['XSRF-TOKEN'];
    const headerToken = req.headers['x-xsrf-token'];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({
            message: 'CSRF validation failed',
            code: 'CSRF_MISMATCH'
        });
    }

    next();
};

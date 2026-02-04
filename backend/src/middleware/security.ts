import type { Request, Response, NextFunction } from 'express';

// Security headers middleware (alternative to helmet for custom control)
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
    // Content Security Policy
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https:; " +
        "connect-src 'self' ws: wss:; " +
        "frame-ancestors 'none';"
    );

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // XSS protection (legacy but still useful)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy
    res.setHeader(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    // HSTS (enable in production)
    if (process.env.NODE_ENV === 'production') {
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );
    }

    // Remove server header
    res.removeHeader('X-Powered-By');

    next();
};

// Error handling middleware (don't leak stack traces)
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err);

    // Don't leak error details in production
    const isDev = process.env.NODE_ENV !== 'production';

    res.status(500).json({
        message: 'An unexpected error occurred',
        ...(isDev && { error: err.message, stack: err.stack })
    });
};

// Request logging for security auditing
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            ip: req.ip,
            userId: (req as any).userId || 'anonymous',
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent')
        };

        // Log suspicious activity
        if (res.statusCode === 401 || res.statusCode === 403) {
            console.warn('[SECURITY] Unauthorized access attempt:', log);
        } else if (res.statusCode === 429) {
            console.warn('[SECURITY] Rate limit exceeded:', log);
        }
    });

    next();
};

// Input size limiting
export const inputSizeLimit = (maxSize: number = 100 * 1024) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const contentLength = parseInt(req.get('Content-Length') || '0', 10);

        if (contentLength > maxSize) {
            return res.status(413).json({
                message: 'Request body too large',
                maxSize: `${maxSize / 1024}KB`
            });
        }

        next();
    };
};

// Sanitize request parameters
export const sanitizeParams = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize query params
    for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
            req.query[key] = sanitizeString(req.query[key] as string);
        }
    }

    // Sanitize URL params
    for (const key in req.params) {
        req.params[key] = sanitizeString(req.params[key]);
    }

    next();
};

const sanitizeString = (input: string): string => {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/data:/gi, '') // Remove data: protocol
        .trim();
};

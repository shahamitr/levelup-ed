import type { Request, Response, NextFunction } from 'express';

// Rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);

interface RateLimitOptions {
  windowMs: number;      // Time window in milliseconds
  max: number;           // Max requests per window
  message?: string;      // Custom error message
  keyGenerator?: (req: Request) => string;  // Custom key generator
}

// Default configurations for different endpoint types
export const rateLimitConfigs = {
  // Strict for auth endpoints (prevent brute force)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 attempts per window
    message: 'Too many login attempts. Please try again in 15 minutes.'
  },
  // Moderate for API endpoints
  api: {
    windowMs: 60 * 1000,       // 1 minute
    max: 100,                  // 100 requests per minute
    message: 'Too many requests. Please slow down.'
  },
  // Strict for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 10,                   // 10 per hour
    message: 'Rate limit exceeded for sensitive operations.'
  }
};

// Rate limiting middleware factory
export const rateLimit = (options: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator 
      ? options.keyGenerator(req) 
      : getClientIdentifier(req);

    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || record.resetTime < now) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      });
      
      setRateLimitHeaders(res, options.max, options.max - 1, now + options.windowMs);
      return next();
    }

    if (record.count >= options.max) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      
      res.set('Retry-After', String(retryAfter));
      setRateLimitHeaders(res, options.max, 0, record.resetTime);
      
      return res.status(429).json({
        message: options.message || 'Too many requests',
        retryAfter
      });
    }

    // Increment counter
    record.count++;
    setRateLimitHeaders(res, options.max, options.max - record.count, record.resetTime);
    
    next();
  };
};

// Get client identifier (IP + user ID if available)
const getClientIdentifier = (req: Request): string => {
  const userId = (req as any).userId || 'anonymous';
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return `${ip}:${userId}`;
};

// Set standard rate limit headers
const setRateLimitHeaders = (
  res: Response, 
  limit: number, 
  remaining: number, 
  resetTime: number
) => {
  res.set({
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.floor(resetTime / 1000))
  });
};

// Slow down middleware (progressive delay)
export const slowDown = (options: { windowMs: number; delayAfter: number; delayMs: number }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = getClientIdentifier(req);
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || record.resetTime < now) {
      rateLimitStore.set(key, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    record.count++;

    if (record.count > options.delayAfter) {
      const delay = (record.count - options.delayAfter) * options.delayMs;
      setTimeout(next, Math.min(delay, 10000)); // Max 10 second delay
    } else {
      next();
    }
  };
};

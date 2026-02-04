import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// ============================================
// AUTH VALIDATION SCHEMAS
// ============================================

export const registerSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .max(255, 'Email too long')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .trim()
});

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .max(255)
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(1, 'Password is required')
        .max(128)
});

// ============================================
// CERTIFICATE VALIDATION SCHEMAS
// ============================================

export const generateCertificateSchema = z.object({
    worldId: z.number()
        .int('World ID must be an integer')
        .positive('World ID must be positive'),
    skills: z.array(z.string().max(100)).optional()
});

// ============================================
// FRIEND/CHALLENGE VALIDATION SCHEMAS
// ============================================

export const sendFriendRequestSchema = z.object({
    receiverId: z.string()
        .uuid('Invalid user ID format')
});

export const respondFriendRequestSchema = z.object({
    friendshipId: z.string()
        .uuid('Invalid friendship ID'),
    accept: z.boolean()
});

export const sendChallengeSchema = z.object({
    receiverId: z.string()
        .uuid('Invalid receiver ID'),
    topic: z.string()
        .min(1, 'Topic is required')
        .max(100, 'Topic too long')
        .trim(),
    worldId: z.number().int().positive().optional()
});

export const respondChallengeSchema = z.object({
    challengeId: z.string()
        .uuid('Invalid challenge ID'),
    accept: z.boolean()
});

export const submitChallengeResultSchema = z.object({
    challengeId: z.string()
        .uuid('Invalid challenge ID'),
    score: z.number()
        .int('Score must be an integer')
        .min(0, 'Score cannot be negative')
        .max(1000, 'Score too high')
});

// ============================================
// STUDY GROUP VALIDATION SCHEMAS
// ============================================

export const createStudyGroupSchema = z.object({
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name too long')
        .trim(),
    topic: z.string()
        .min(2, 'Topic is required')
        .max(100, 'Topic too long')
        .trim(),
    description: z.string()
        .max(500, 'Description too long')
        .optional(),
    maxMembers: z.number()
        .int()
        .min(2, 'Group must allow at least 2 members')
        .max(50, 'Maximum 50 members')
        .optional()
        .default(10),
    isPublic: z.boolean().optional().default(true)
});

export const joinStudyGroupSchema = z.object({
    groupId: z.string()
        .uuid('Invalid group ID')
});

export const sendGroupMessageSchema = z.object({
    groupId: z.string()
        .uuid('Invalid group ID'),
    content: z.string()
        .min(1, 'Message cannot be empty')
        .max(2000, 'Message too long')
        .trim()
});

// ============================================
// HEARTS VALIDATION SCHEMAS
// ============================================

export const buyHeartsSchema = z.object({
    amount: z.number()
        .int()
        .min(1, 'Must buy at least 1 heart')
        .max(5, 'Cannot buy more than 5 hearts')
        .optional()
        .default(1)
});

// ============================================
// SEARCH VALIDATION
// ============================================

export const searchQuerySchema = z.object({
    query: z.string()
        .min(1, 'Search query required')
        .max(100, 'Query too long')
        .trim()
});

// ============================================
// VALIDATION MIDDLEWARE FACTORY
// ============================================

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = <T extends z.ZodSchema>(
    schema: T,
    target: ValidationTarget = 'body'
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = target === 'body' ? req.body
                : target === 'query' ? req.query
                    : req.params;

            const result = schema.safeParse(data);

            if (!result.success) {
                const errors = result.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return res.status(400).json({
                    message: 'Validation failed',
                    errors
                });
            }

            // Replace with validated/sanitized data
            if (target === 'body') {
                req.body = result.data;
            } else if (target === 'query') {
                (req as any).validatedQuery = result.data;
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Validation error' });
        }
    };
};

// ============================================
// SANITIZATION UTILITIES
// ============================================

// Basic XSS sanitization
export const sanitizeHtml = (input: string): string => {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

// Strip dangerous patterns
export const sanitizeInput = (input: string): string => {
    // Remove potential script injections
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
};

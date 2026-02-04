// AI Status and Quota Monitoring Controller

import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiService } from '../services/ai';
import { fallbackContent } from '../services/fallbackContent';

const prisma = new PrismaClient();

// Get current AI service status
export const getAIStatus = async (req: Request, res: Response) => {
    try {
        const status = await aiService.getStatus();
        const cacheStats = fallbackContent.getStats();
        const suggestedTopics = await fallbackContent.getSuggestedTopics();

        res.json({
            status: 'operational',
            providers: status.providers.map(p => ({
                name: p.name,
                available: p.available,
                latency: p.latency,
                errorCount: p.errorCount
            })),
            quotas: status.quotas.map(q => ({
                provider: q.provider,
                percentUsed: q.quota.percentUsed.toFixed(1),
                remaining: q.quota.remaining,
                resetAt: q.quota.resetAt
            })),
            fallback: {
                cacheHitRate: cacheStats.hitRate.toFixed(1) + '%',
                cachedTopics: cacheStats.cachedTopics,
                suggestedTopics: suggestedTopics.slice(0, 10)
            },
            primaryAvailable: status.primaryAvailable
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get AI status' });
    }
};

// Get quota alerts for admin dashboard
export const getQuotaAlerts = async (req: Request, res: Response) => {
    try {
        const alerts = await prisma.aIQuotaAlert.findMany({
            where: { acknowledged: false },
            orderBy: { alertedAt: 'desc' },
            take: 20
        });

        res.json({ alerts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get alerts' });
    }
};

// Acknowledge an alert
export const acknowledgeAlert = async (req: Request, res: Response) => {
    try {
        const { alertId } = req.body;

        await prisma.aIQuotaAlert.update({
            where: { id: alertId },
            data: { acknowledged: true }
        });

        res.json({ message: 'Alert acknowledged' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to acknowledge alert' });
    }
};

// Get AI usage statistics
export const getUsageStats = async (req: Request, res: Response) => {
    try {
        const { period = 'day' } = req.query;

        const startDate = new Date();
        if (period === 'day') {
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        }

        // Aggregate usage by provider
        const usage = await prisma.aIUsageLog.groupBy({
            by: ['provider'],
            where: { createdAt: { gte: startDate } },
            _sum: { tokensUsed: true },
            _count: { id: true },
            _avg: { latencyMs: true }
        });

        // Error rate
        const errors = await prisma.aIUsageLog.groupBy({
            by: ['provider'],
            where: {
                createdAt: { gte: startDate },
                success: false
            },
            _count: { id: true }
        });

        // Recent usage trend (hourly for day, daily for week/month)
        const trend = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('hour', "createdAt") as period,
        SUM("tokensUsed") as tokens,
        COUNT(*) as requests
      FROM "AIUsageLog"
      WHERE "createdAt" >= ${startDate}
      GROUP BY period
      ORDER BY period
    ` as any[];

        res.json({
            period,
            usage: usage.map(u => ({
                provider: u.provider,
                totalTokens: u._sum.tokensUsed || 0,
                requests: u._count.id,
                avgLatency: Math.round(u._avg.latencyMs || 0)
            })),
            errors: errors.map(e => ({
                provider: e.provider,
                count: e._count.id
            })),
            trend
        });
    } catch (error) {
        console.error('Usage stats error:', error);
        res.status(500).json({ message: 'Failed to get usage stats' });
    }
};

// Log AI usage (internal use)
export const logAIUsage = async (
    provider: string,
    tokensUsed: number,
    endpoint: string,
    latencyMs: number,
    userId?: string,
    success: boolean = true,
    errorMessage?: string
) => {
    try {
        await prisma.aIUsageLog.create({
            data: {
                provider,
                tokensUsed,
                endpoint,
                userId,
                latencyMs,
                success,
                errorMessage
            }
        });
    } catch (error) {
        console.error('Failed to log AI usage:', error);
    }
};

// Record quota alert
export const recordQuotaAlert = async (
    provider: string,
    threshold: number,
    percentUsed: number
) => {
    try {
        await prisma.aIQuotaAlert.create({
            data: {
                provider,
                threshold,
                percentUsed
            }
        });
    } catch (error) {
        console.error('Failed to record quota alert:', error);
    }
};

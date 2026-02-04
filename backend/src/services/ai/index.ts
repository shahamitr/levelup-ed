// AI Service Manager - Orchestrates providers with fallback and monitoring

import type { AIProvider, AICompletionRequest, AICompletionResponse, QuotaStatus, ProviderHealth } from './types';
import { geminiProvider } from './gemini.provider';
import { openaiProvider } from './openai.provider';

// Alert thresholds
const QUOTA_ALERT_THRESHOLDS = [80, 90, 95, 99];

// Alert callback type
type AlertCallback = (provider: string, percentUsed: number, threshold: number) => void;

class AIServiceManager {
    private providers: AIProvider[] = [];
    private healthStatus: Map<string, ProviderHealth> = new Map();
    private alertCallbacks: AlertCallback[] = [];
    private alertedThresholds: Map<string, Set<number>> = new Map();
    private healthCheckInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Register providers in priority order
        this.providers = [geminiProvider, openaiProvider];

        // Initialize health status
        this.providers.forEach(p => {
            this.healthStatus.set(p.name, {
                name: p.name,
                available: false,
                latency: 0,
                lastChecked: new Date(0),
                errorCount: 0
            });
            this.alertedThresholds.set(p.name, new Set());
        });
    }

    // Start periodic health checks
    startHealthChecks(intervalMs: number = 60000): void {
        if (this.healthCheckInterval) return;

        this.healthCheckInterval = setInterval(() => {
            this.checkAllProviders();
        }, intervalMs);

        // Initial check
        this.checkAllProviders();
    }

    stopHealthChecks(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    // Check all provider health
    async checkAllProviders(): Promise<void> {
        for (const provider of this.providers) {
            await this.checkProviderHealth(provider);
            await this.checkQuotaAlerts(provider);
        }
    }

    private async checkProviderHealth(provider: AIProvider): Promise<void> {
        const startTime = Date.now();
        try {
            const available = await provider.isAvailable();
            const latency = Date.now() - startTime;

            const status = this.healthStatus.get(provider.name)!;
            status.available = available;
            status.latency = latency;
            status.lastChecked = new Date();
            if (available) status.errorCount = 0;
        } catch {
            const status = this.healthStatus.get(provider.name)!;
            status.available = false;
            status.lastChecked = new Date();
            status.errorCount++;
        }
    }

    private async checkQuotaAlerts(provider: AIProvider): Promise<void> {
        try {
            const quota = await provider.getQuotaStatus();
            const alertedSet = this.alertedThresholds.get(provider.name)!;

            for (const threshold of QUOTA_ALERT_THRESHOLDS) {
                if (quota.percentUsed >= threshold && !alertedSet.has(threshold)) {
                    alertedSet.add(threshold);
                    this.triggerAlert(provider.name, quota.percentUsed, threshold);
                }
            }

            // Reset alerts on new day
            if (quota.percentUsed < 10) {
                alertedSet.clear();
            }
        } catch (error) {
            console.error(`Quota check failed for ${provider.name}:`, error);
        }
    }

    private triggerAlert(provider: string, percentUsed: number, threshold: number): void {
        console.warn(`[QUOTA ALERT] ${provider}: ${percentUsed.toFixed(1)}% used (threshold: ${threshold}%)`);
        this.alertCallbacks.forEach(cb => cb(provider, percentUsed, threshold));
    }

    // Register alert callback
    onQuotaAlert(callback: AlertCallback): void {
        this.alertCallbacks.push(callback);
    }

    // Get first available provider
    private async getAvailableProvider(): Promise<AIProvider | null> {
        for (const provider of this.providers) {
            const health = this.healthStatus.get(provider.name);

            // Skip if recently checked and unavailable
            if (health && !health.available &&
                Date.now() - health.lastChecked.getTime() < 30000) {
                continue;
            }

            // Check quota
            try {
                const quota = await provider.getQuotaStatus();
                if (quota.remaining <= 0) {
                    console.warn(`${provider.name} quota exhausted`);
                    continue;
                }
            } catch {
                continue;
            }

            // Check availability
            const available = await provider.isAvailable();
            if (available) return provider;
        }
        return null;
    }

    // Main completion method with automatic fallback
    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        const errors: string[] = [];

        for (const provider of this.providers) {
            try {
                // Check if provider is available
                const health = this.healthStatus.get(provider.name);
                if (health?.errorCount && health.errorCount > 5) {
                    console.log(`Skipping ${provider.name} due to high error count`);
                    continue;
                }

                // Check quota
                const quota = await provider.getQuotaStatus();
                if (quota.remaining <= 0) {
                    console.warn(`Skipping ${provider.name} - quota exhausted`);
                    continue;
                }

                // Attempt completion
                const response = await provider.complete(request);

                // Reset error count on success
                if (health) health.errorCount = 0;

                // Check quota after completion
                await this.checkQuotaAlerts(provider);

                return response;
            } catch (error: any) {
                const errorMsg = `${provider.name}: ${error.message}`;
                errors.push(errorMsg);
                console.error(`Provider ${provider.name} failed:`, error.message);

                // Increment error count
                const health = this.healthStatus.get(provider.name);
                if (health) health.errorCount++;
            }
        }

        throw new Error(`All AI providers failed: ${errors.join('; ')}`);
    }

    // Get status of all providers
    async getStatus(): Promise<{
        providers: ProviderHealth[];
        quotas: { provider: string; quota: QuotaStatus }[];
        primaryAvailable: boolean;
    }> {
        const quotas: { provider: string; quota: QuotaStatus }[] = [];

        for (const provider of this.providers) {
            try {
                const quota = await provider.getQuotaStatus();
                quotas.push({ provider: provider.name, quota });
            } catch {
                quotas.push({
                    provider: provider.name,
                    quota: { remaining: 0, total: 0, resetAt: null, percentUsed: 100 }
                });
            }
        }

        const primaryHealth = this.healthStatus.get(this.providers[0]?.name);

        return {
            providers: Array.from(this.healthStatus.values()),
            quotas,
            primaryAvailable: primaryHealth?.available || false
        };
    }

    // Get quota for specific provider
    async getQuota(providerName?: string): Promise<QuotaStatus> {
        const provider = providerName
            ? this.providers.find(p => p.name === providerName)
            : this.providers[0];

        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }

        return provider.getQuotaStatus();
    }
}

// Export singleton instance
export const aiService = new AIServiceManager();

// Start health checks on module load
aiService.startHealthChecks();

// Export types
export * from './types';

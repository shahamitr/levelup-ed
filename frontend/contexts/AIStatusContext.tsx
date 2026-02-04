// AI Status Context and Hook for Graceful Degradation

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types
interface ProviderStatus {
    name: string;
    available: boolean;
    latency: number;
    errorCount: number;
}

interface QuotaInfo {
    provider: string;
    percentUsed: string;
    remaining: number;
    resetAt: string | null;
}

interface AIStatus {
    status: 'operational' | 'degraded' | 'offline';
    providers: ProviderStatus[];
    quotas: QuotaInfo[];
    primaryAvailable: boolean;
    fallback: {
        cacheHitRate: string;
        cachedTopics: number;
        suggestedTopics: string[];
    };
    lastChecked: Date;
}

interface AIStatusContextType {
    status: AIStatus | null;
    isLoading: boolean;
    error: string | null;
    isAIAvailable: boolean;
    suggestedTopics: string[];
    refresh: () => Promise<void>;
}

const defaultStatus: AIStatus = {
    status: 'offline',
    providers: [],
    quotas: [],
    primaryAvailable: false,
    fallback: { cacheHitRate: '0%', cachedTopics: 0, suggestedTopics: [] },
    lastChecked: new Date()
};

// Context
const AIStatusContext = createContext<AIStatusContextType | null>(null);

// Provider component
interface AIStatusProviderProps {
    children: ReactNode;
    pollInterval?: number; // ms, default 60000 (1 min)
}

export const AIStatusProvider: React.FC<AIStatusProviderProps> = ({
    children,
    pollInterval = 60000
}) => {
    const [status, setStatus] = useState<AIStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/ai/status`);

            if (!response.ok) {
                throw new Error('Failed to fetch AI status');
            }

            const data = await response.json();
            setStatus({
                ...data,
                lastChecked: new Date()
            });
            setError(null);
        } catch (err) {
            console.error('AI status fetch failed:', err);
            setError('Unable to check AI service status');
            // Set as degraded, not completely offline
            setStatus(prev => prev ? { ...prev, status: 'degraded' } : defaultStatus);
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE]);

    // Initial fetch and polling
    useEffect(() => {
        fetchStatus();

        const interval = setInterval(fetchStatus, pollInterval);
        return () => clearInterval(interval);
    }, [fetchStatus, pollInterval]);

    const isAIAvailable = status?.primaryAvailable ||
        status?.providers.some(p => p.available) ||
        false;

    const suggestedTopics = status?.fallback?.suggestedTopics || [];

    const value: AIStatusContextType = {
        status,
        isLoading,
        error,
        isAIAvailable,
        suggestedTopics,
        refresh: fetchStatus
    };

    return (
        <AIStatusContext.Provider value={value}>
            {children}
        </AIStatusContext.Provider>
    );
};

// Hook to use AI status
export const useAIStatus = (): AIStatusContextType => {
    const context = useContext(AIStatusContext);
    if (!context) {
        throw new Error('useAIStatus must be used within AIStatusProvider');
    }
    return context;
};

// Hook for checking if AI call should be attempted
export const useAIAvailability = () => {
    const { isAIAvailable, status, suggestedTopics } = useAIStatus();

    return {
        canUseAI: isAIAvailable,
        shouldUseFallback: !isAIAvailable && (status?.fallback?.cachedTopics || 0) > 0,
        suggestedTopics,
        quotaWarning: status?.quotas.some(q => parseFloat(q.percentUsed) > 80) || false
    };
};

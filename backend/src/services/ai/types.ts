// AI Provider Abstraction Layer
// Supports multiple providers with automatic fallback

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AICompletionRequest {
    messages: AIMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
}

export interface AICompletionResponse {
    content: string;
    provider: string;
    tokensUsed: number;
    model: string;
}

export interface AIProvider {
    name: string;
    isAvailable(): Promise<boolean>;
    complete(request: AICompletionRequest): Promise<AICompletionResponse>;
    getQuotaStatus(): Promise<QuotaStatus>;
}

export interface QuotaStatus {
    remaining: number;
    total: number;
    resetAt: Date | null;
    percentUsed: number;
}

// Provider health status
export interface ProviderHealth {
    name: string;
    available: boolean;
    latency: number;
    lastChecked: Date;
    errorCount: number;
}

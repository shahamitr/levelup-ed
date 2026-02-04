// OpenAI Provider Implementation (Fallback)

import type { AIProvider, AICompletionRequest, AICompletionResponse, QuotaStatus } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIProvider implements AIProvider {
    name = 'openai';
    private apiKey: string;
    private model: string;
    private tokensUsedToday: number = 0;
    private dailyLimit: number;
    private lastReset: Date;

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || '';
        this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        this.dailyLimit = parseInt(process.env.OPENAI_DAILY_LIMIT || '500000', 10);
        this.lastReset = new Date();
        this.lastReset.setHours(0, 0, 0, 0);
    }

    async isAvailable(): Promise<boolean> {
        if (!this.apiKey) return false;

        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: request.model || this.model,
                messages: request.messages.map(m => ({
                    role: m.role,
                    content: m.content
                })),
                max_tokens: request.maxTokens || 2048,
                temperature: request.temperature || 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        const tokensUsed = data.usage?.total_tokens || 0;

        // Track usage
        this.tokensUsedToday += tokensUsed;

        return {
            content,
            provider: this.name,
            tokensUsed,
            model: data.model || this.model
        };
    }

    async getQuotaStatus(): Promise<QuotaStatus> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (today > this.lastReset) {
            this.tokensUsedToday = 0;
            this.lastReset = today;
        }

        const remaining = Math.max(0, this.dailyLimit - this.tokensUsedToday);
        const resetAt = new Date(today);
        resetAt.setDate(resetAt.getDate() + 1);

        return {
            remaining,
            total: this.dailyLimit,
            resetAt,
            percentUsed: (this.tokensUsedToday / this.dailyLimit) * 100
        };
    }

    setTokensUsed(tokens: number): void {
        this.tokensUsedToday = tokens;
    }
}

export const openaiProvider = new OpenAIProvider();

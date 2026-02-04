// Gemini AI Provider Implementation

import type { AIProvider, AICompletionRequest, AICompletionResponse, QuotaStatus } from './types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiProvider implements AIProvider {
    name = 'gemini';
    private apiKey: string;
    private model: string;
    private tokensUsedToday: number = 0;
    private dailyLimit: number;
    private lastReset: Date;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        this.dailyLimit = parseInt(process.env.GEMINI_DAILY_LIMIT || '1000000', 10);
        this.lastReset = new Date();
        this.lastReset.setHours(0, 0, 0, 0);
    }

    async isAvailable(): Promise<boolean> {
        if (!this.apiKey) return false;

        try {
            const response = await fetch(
                `${GEMINI_API_URL}/${this.model}?key=${this.apiKey}`,
                { method: 'GET' }
            );
            return response.ok;
        } catch {
            return false;
        }
    }

    async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
        const url = `${GEMINI_API_URL}/${this.model}:generateContent?key=${this.apiKey}`;

        // Convert messages to Gemini format
        const contents = request.messages
            .filter(m => m.role !== 'system')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));

        // Add system instruction if present
        const systemMessage = request.messages.find(m => m.role === 'system');

        const body: any = {
            contents,
            generationConfig: {
                maxOutputTokens: request.maxTokens || 2048,
                temperature: request.temperature || 0.7
            }
        };

        if (systemMessage) {
            body.systemInstruction = { parts: [{ text: systemMessage.content }] };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

        // Track usage
        this.tokensUsedToday += tokensUsed;

        return {
            content,
            provider: this.name,
            tokensUsed,
            model: this.model
        };
    }

    async getQuotaStatus(): Promise<QuotaStatus> {
        // Reset counter if new day
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

    // Update usage from external source (e.g., database)
    setTokensUsed(tokens: number): void {
        this.tokensUsedToday = tokens;
    }
}

export const geminiProvider = new GeminiProvider();

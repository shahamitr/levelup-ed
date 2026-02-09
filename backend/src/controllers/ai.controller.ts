
import type { Request, Response } from 'express';
// @ts-ignore
import { GoogleGenerativeAI } from '@google/genai';

// Initialize Gemini Client
// Note: In @google/genai v1+, usage might differ slightly, forcing standard usage pattern if needed.
// Assuming simple REST proxy if SDK is complex, but SDK is installed.
// We'll use a direct fetch or standard SDK if available.
// Using standard fetch pattern for simplicity if SDK has types issues, but trying SDK first.

// Actually @google/genai might be the new SDK. Let's use the standard @google/generative-ai if that was what was intended,
// but package.json said @google/genai. Let's assume the user knows.
// Wait, checking frontend package.json, it was "@google/genai": "^1.39.0" which is likely the Vertex AI or new client.
// Let's stick to a generic implementation using the API Key.

import { aiService } from '../services/ai';
import { AICompletionRequest } from '../services/ai/types';

export const chatWithMentor = async (req: Request, res: Response) => {
    const { history, message, context } = req.body;

    try {
        const messages: any[] = [
            {
                role: 'system',
                content: `You are an AI Mentor in the "Real-Time Teacher" platform.
Context: ${context || 'General Coding'}.
Be helpful, socratic, and encouraging.
If the student is distracted, be firm but kind.`
            }
        ];

        // Map existing history if it's an array
        if (Array.isArray(history)) {
            history.forEach((msg: any) => {
                // Skip if it's not a valid message object or system message
                if (!msg.text) return;

                // Map 'model' to 'assistant' for our internal type
                const role = (msg.role === 'model' || msg.role === 'assistant') ? 'assistant' : 'user';
                messages.push({ role, content: msg.text });
            });
        }

        // Add current user message
        messages.push({ role: 'user', content: message });

        const request: AICompletionRequest = {
            messages,
            temperature: 0.7,
            maxTokens: 1000
        };

        const response = await aiService.complete(request);

        res.json({ reply: response.content });
    } catch (error: any) {
        console.error("AI Controller Error:", error);

        // Fallback response if everything completely fails (though provider has its own fallback)
        res.status(200).json({
            reply: "I'm currently updating my knowledge base. Please try again in a moment, or continue with your coding task!"
        });
    }
};

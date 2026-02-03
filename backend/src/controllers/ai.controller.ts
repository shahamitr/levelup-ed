
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

const GEN_AI_KEY = process.env.GEMINI_API_KEY || '';

export const chatWithMentor = async (req: Request, res: Response) => {
    const { history, message, context } = req.body;

    try {
        // Construct prompt
        const systemPrompt = `You are an AI Mentor in the "Real-Time Teacher" platform.
    Context: ${context}.
    Be helpful, socratic, and encouraging.
    If the student is distracted, be firm but kind.`;

        const fullPrompt = `${systemPrompt}\n\nChat History:\n${JSON.stringify(history)}\n\nUser: ${message}\nMentor:`;

        // Direct API call to Gemini (Models API) to avoid SDK version conflicts in this quick setup
        // POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=...

        // We will use the REST API for maximum reliability without debugging SDK types in the "Blind" backend
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEN_AI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: fullPrompt }]
                }]
            })
        });

        const data = await response.json() as any;

        if (data.error) {
            console.error('Gemini Error:', data.error);
            return res.status(500).json({ message: 'AI Error', details: data.error });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";

        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing AI request' });
    }
};

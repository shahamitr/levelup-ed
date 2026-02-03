
import { aiService } from './api';
import { Message } from '../types';
import { BOSS_SYSTEM_PROMPT, COACH_SYSTEM_PROMPT } from '../constants';

/**
 * Generates a full lesson module using the backend AI proxy.
 */
export const generateLessonContent = async (worldName: string, level: number): Promise<string> => {
  try {
    const prompt = `Act as a Cybernetic Career Architect.
    Task: Generate Module ${level} for the course "${worldName}".

    Structure:
    1. **Mission Briefing**: A high-stakes, futuristic RPG narrative intro.
    2. **Technical Download**: Explain ONE core technical concept (e.g. Flexbox, SQL Indexing).
    3. **Holographic Schematic**: You MUST include a Mermaid diagram explaining the concept wrapped in <holodeck type="mermaid">...</holodeck> tags.
    4. **Code Schematics**: Provide a code block.
    5. **Mission Objectives**: 3 bullet points.

    Format: Markdown.`;

    const response = await aiService.chat(prompt, [], "Lesson Generator");
    return response.data.reply;
  } catch (error) {
    console.error("Lesson Gen Error:", error);
    return "## Connection Lost\nUnable to retrieve mission data. Please retry.";
  }
};

/**
 * Evaluates a boss fight answer.
 */
export const evaluateBossAnswer = async (
  bossName: string,
  topic: string,
  question: string,
  userAnswer: string
): Promise<{ damage: number; dialogue: string; isCorrect: boolean; learningResource?: { title: string; description: string } }> => {
  try {
    const prompt = `Evaluate Answer: Q:"${question}" A:"${userAnswer}" for topic: ${topic}.

    Return ONLY valid JSON in this format:
    {
      "isCorrect": boolean,
      "damage": number (0-40 based on quality),
      "dialogue": "string (in character)",
      "learningResource": { "title": "Concept Name", "description": "1 sentence explanation of what they missed" } (ONLY IF isCorrect is false)
    }`;

    // We pass a specialized context to the general chat endpoint
    const response = await aiService.chat(prompt, [], `You are ${bossName}. ${BOSS_SYSTEM_PROMPT}. You MUST return JSON only.`);

    // Parse the response, trying to find JSON block
    let text = response.data.reply;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    return JSON.parse(text);
  } catch (error) {
    console.error("Boss Eval Error:", error);
    return { damage: 0, dialogue: "I didn't quite catch that. (System Error)", isCorrect: false };
  }
};

/**
 * Just-in-Time Learning: Explains a concept briefly.
 */
export const explainConcept = async (concept: string, contextCode?: string): Promise<string> => {
  try {
    const prompt = `Explain the concept "${concept}" in 30 seconds (max 3 sentences).
     ${contextCode ? `Context: ${contextCode}` : ''}
     Focus on the 'Why' and 'How'.`;

    const response = await aiService.chat(prompt, [], "Expert Tutor");
    return response.data.reply;
  } catch (error) {
    return "Unable to retrieve explanation.";
  }
};

/**
 * Generates the next boss question with adaptation
 */
export const generateBossQuestion = async (
  bossName: string,
  topic: string,
  difficulty: number,
  previousContext?: { lastQuestion: string, wasCorrect: boolean, timeTaken?: number, totalMistakes?: number }
): Promise<string> => {
  try {
    let adaptation = "";
    if (previousContext) {
      adaptation = previousContext.wasCorrect
        ? `User answered correctly in ${previousContext.timeTaken?.toFixed(1) || 'normal'}s. Increase difficulty.`
        : `User failed the last question: "${previousContext.lastQuestion}". Total mistakes: ${previousContext.totalMistakes || 1}. Simplify the next question significantly.`;
    }

    const prompt = `Ask a technical interview question for "${topic}" at difficulty Level ${difficulty}/5.
      ${adaptation}
      Keep it short (max 2 sentences).`;

    const response = await aiService.chat(prompt, [], `You are ${bossName}. ${BOSS_SYSTEM_PROMPT}`);
    return response.data.reply;
  } catch (error) {
    return "Explain the concept of 'Recursion' in your own words."; // Fallback
  }
};

export const chatWithCoach = async (history: Message[], userMessage: string, context: string): Promise<string> => {
  try {
    const systemPrompt = `${COACH_SYSTEM_PROMPT}
    Current Status: ${context}
    CAPABILITY UPDATE: You can now project holographic schemas. If a concept is complex (e.g. flow, hierarchy, architecture), YOU MUST output a valid Mermaid diagram wrapped in <holodeck type="mermaid">...</holodeck> tags.`;

    const response = await aiService.chat(userMessage, history, systemPrompt);
    return response.data.reply;
  } catch (error) {
    return "I am receiving interference. Please repeat.";
  }
};

// TTS Stub - Backend implementation recommended for real TTS
export const generateCoachSpeech = async (text: string): Promise<string | null> => {
  return null;
};

/**
 * Generates a new World configuration from a user topic.
 */
export const generateWorldFromTopic = async (topic: string): Promise<any> => {
  try {
    const prompt = `Act as a Game Designer. Create a new "World" for the learning platform based on the topic: "${topic}".

    Return VALID JSON with this structure:
    {
      "id": "slug-id",
      "name": "Title Case Name",
      "description": "Short futuristic sub-header",
      "totalLevels": 5,
      "bossName": "Cool Boss Name",
      "bossType": "The Architect | The Firewall | etc",
      "bossAvatar": "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${topic}",
      "themeId": "web-brutalism" (pick one of: web-brutalism, data-glass, cyber-matrix, ai-ethereal that best fits)
    }

    Keep descriptions punchy and gamified.`;

    const response = await aiService.chat(prompt, [], "World Generator");
    let text = response.data.reply;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    return JSON.parse(text);
  } catch (error) {
    console.error("World Gen Error:", error);
    return null;
  }
};

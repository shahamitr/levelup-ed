
// Simple Sound Types
type SoundType = 'success' | 'failure' | 'xp' | 'attack' | 'levelUp';

const SOUNDS: Record<SoundType, string> = {
    // Using free placeholder sounds or data URIs for the prototype
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.m4a', // Arcade game achievement
    failure: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.m4a', // Retro failure
    xp: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.m4a',       // Coin pickup
    attack: 'https://assets.mixkit.co/active_storage/sfx/2101/2101-preview.m4a',   // Sci-fi laser or hit
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.m4a'   // Level up fanfare
};

export const playSound = (type: SoundType) => {
    try {
        const audio = new Audio(SOUNDS[type]);
        audio.volume = 0.5; // Reasonable default
        audio.play().catch(e => console.warn("Audio play blocked (user gesture required):", e));
    } catch (e) {
        console.error("Audio error:", e);
    }
};

export const speak = (text: string, mood: 'happy' | 'sad' | 'neutral' = 'neutral') => {
    if (!window.speechSynthesis) return;

    // Cancel previous
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = mood === 'happy' ? 1.2 : mood === 'sad' ? 0.8 : 1.0;

    // Try to select a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Female'));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
};

export function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
}

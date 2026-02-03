
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('leveluped_state_v1');
    if (userStr) {
        // Note: In a real app we would store token separately.
        // For this prototype, we'll assume the token is stored in localStorage key 'token'
        // or we might need to adjust based on how we stored it in Login.
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

export const authService = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    register: (username: string, email: string, password: string) => api.post('/auth/register', { username, email, password }),
};

export const gameService = {
    getWorlds: () => api.get('/game/worlds'),
    saveProgress: (data: any) => api.post('/game/progress', data),
};

export const aiService = {
    chat: (message: string, history: any[], context: string) => api.post('/ai/chat', { message, history, context }),
};

export default api;

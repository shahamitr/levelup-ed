// API client with CSRF and security features

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let csrfToken: string | null = null;
let csrfExpiry: number = 0;

// Fetch CSRF token
export const fetchCsrfToken = async (): Promise<string> => {
    // Return cached token if still valid
    if (csrfToken && Date.now() < csrfExpiry) {
        return csrfToken;
    }

    const response = await fetch(`${API_BASE}/api/csrf-token`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
    }

    const data = await response.json();
    csrfToken = data.csrfToken;
    csrfExpiry = Date.now() + (data.expiresIn * 1000) - 60000; // Refresh 1 min early

    return csrfToken;
};

// Get auth token from storage
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// API request helper with security features
interface RequestOptions extends RequestInit {
    skipCsrf?: boolean;
    skipAuth?: boolean;
}

export const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    const { skipCsrf = false, skipAuth = false, ...fetchOptions } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {})
    };

    // Add auth token
    if (!skipAuth) {
        const token = getAuthToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    // Add CSRF token for mutating requests
    const method = fetchOptions.method?.toUpperCase() || 'GET';
    if (!skipCsrf && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
        const token = await fetchCsrfToken();
        (headers as Record<string, string>)['X-CSRF-Token'] = token;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOptions,
        headers,
        credentials: 'include'
    });

    // Handle rate limiting
    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Too many requests. Please wait ${retryAfter} seconds.`);
    }

    // Handle CSRF errors
    if (response.status === 403) {
        const data = await response.json();
        if (data.code === 'CSRF_INVALID' || data.code === 'CSRF_MISSING') {
            // Clear cached token and retry once
            csrfToken = null;
            csrfExpiry = 0;
            throw new Error('Security token expired. Please try again.');
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
};

// Convenience methods
export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

    patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) })
};

// Auth-specific helpers
export const authApi = {
    login: (email: string, password: string) =>
        api.post<{ token: string; user: any; message: string }>('/api/auth/login', { email, password }, { skipAuth: true }),

    register: (email: string, password: string, username: string) =>
        api.post<{ token: string; user: any }>('/api/auth/register', { email, password, username }, { skipAuth: true }),

    logout: () => {
        localStorage.removeItem('token');
        csrfToken = null;
        csrfExpiry = 0;
    }
};

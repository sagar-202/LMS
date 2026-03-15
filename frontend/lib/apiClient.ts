import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

let isRefreshing = false;
let refreshSubscribers: ((accessToken: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (accessToken: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (accessToken: string) => {
    refreshSubscribers.forEach((cb) => cb(accessToken));
    refreshSubscribers = [];
};

export async function apiFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Access token should be stored in Zustand authStore
    const { accessToken, setAccessToken } = useAuthStore.getState();

    // Automatically attach Authorization header with access token
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
        credentials: 'include', // Ensures cookies (e.g. refresh token) are sent
    };

    let response = await fetch(fullUrl, config);

    // If the backend returns 401:
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            try {
                // call POST /api/auth/refresh
                const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const text = await refreshResponse.text();
                    const result = text ? JSON.parse(text) : null;
                    const newAccessToken = result?.data?.accessToken;
                    setAccessToken(newAccessToken);

                    isRefreshing = false;
                    onRefreshed(newAccessToken);

                    // retry the original request once
                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    config.headers = headers;
                    response = await fetch(fullUrl, config);
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (error) {
                // If refresh fails: clear auth state, redirect user to /auth/login
                isRefreshing = false;
                useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false });
                onRefreshed('');
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                throw new Error('Session expired');
            }
        } else {
            // Wait for the active refresh to complete
            return new Promise<T>((resolve, reject) => {
                subscribeTokenRefresh(async (newToken: string) => {
                    if (newToken) {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        config.headers = headers;
                        try {
                            const retryResponse = await fetch(fullUrl, config);
                            if (!retryResponse.ok) {
                                const errorText = await retryResponse.text();
                                const errorData = errorText ? JSON.parse(errorText) : {};
                                reject(new Error(errorData.message || 'API request failed'));
                            } else {
                                const retryText = await retryResponse.text();
                                const retryData: T = retryText ? JSON.parse(retryText) : null;
                                resolve(retryData);
                            }
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject(new Error('Session expired'));
                    }
                });
            });
        }
    }

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const errorData = errorText ? JSON.parse(errorText) : {};
        throw new Error(errorData.message || 'API request failed');
    }

    // Safe JSON parsing that handles empty bodies
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    // If the response follows our { success: true, data: ... } pattern, extract the data
    if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
        return result.data as T;
    }

    return result as T;
}

export async function get<T = any>(url: string): Promise<T> {
    return apiFetch<T>(url, { method: 'GET' });
}

export async function post<T = any>(url: string, body: any): Promise<T> {
    return apiFetch<T>(url, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

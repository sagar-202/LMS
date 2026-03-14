import { useAuthStore } from './authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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
    const { accessToken, clearAuth, setAccessToken } = useAuthStore.getState();

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
                const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newAccessToken = data.accessToken;
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
                clearAuth();
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
                                const errorData = await retryResponse.json().catch(() => ({}));
                                reject(new Error(errorData.message || 'API request failed'));
                            } else {
                                const retryData: T = await retryResponse.json();
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    // Return JSON automatically
    return response.json() as Promise<T>;
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

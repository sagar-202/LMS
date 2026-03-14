const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Helper to get the access token from localStorage
 * Safe to call on the server (returns null)
 */
const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

/**
 * Helper to set the access token in localStorage
 */
const setAccessToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
    }
};

/**
 * Helper to remove the access token in localStorage
 */
const removeAccessToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
    }
};

let isRefreshing = false;
let refreshSubscribers: ((accessToken: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (accessToken: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (accessToken: string) => {
    refreshSubscribers.forEach((cb) => cb(accessToken));
    refreshSubscribers = [];
};

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    const token = getAccessToken();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Include credentials for the refresh token cookie
    const config: RequestInit = {
        ...options,
        headers,
        credentials: 'include',
    };

    let response = await fetch(url, config);

    // If unauthorized, attempt to refresh the token
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    setAccessToken(data.accessToken);
                    isRefreshing = false;
                    onRefreshed(data.accessToken);

                    // Retry the original request
                    headers.set('Authorization', `Bearer ${data.accessToken}`);
                    config.headers = headers;
                    response = await fetch(url, config);
                } else {
                    // Refresh failed, user is logged out
                    removeAccessToken();
                    isRefreshing = false;
                    onRefreshed('');
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                    throw new Error('Session expired');
                }
            } catch (error) {
                isRefreshing = false;
                removeAccessToken();
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                throw error;
            }
        } else {
            // Wait for the token refresh to complete, then retry
            return new Promise((resolve) => {
                subscribeTokenRefresh(async (newToken: string) => {
                    if (newToken) {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        config.headers = headers;
                        const retryResponse = await fetch(url, config);
                        const retryData = await retryResponse.json();
                        resolve(retryData);
                    }
                });
            });
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

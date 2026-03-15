import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export interface User {
    id: number;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    isInitialized: boolean;

    initializeAuth: () => Promise<void>;
    setAccessToken: (token: string) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    isInitialized: false,

    initializeAuth: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const text = await response.text();
                const result = text ? JSON.parse(text) : null;
                const token = result?.data?.accessToken;
                if (token) {
                    const decodedUser = jwtDecode<User>(token);
                    set({
                        accessToken: token,
                        user: decodedUser,
                        isAuthenticated: true,
                    });
                }
            }
        } catch (e) {
            console.error('Auth initialization failed', e);
        } finally {
            set({ isInitialized: true });
        }
    },
    setAccessToken: (token: string) => {
        try {
            const decodedUser = jwtDecode<User>(token);
            set({
                accessToken: token,
                user: decodedUser,
                isAuthenticated: true,
            });
        } catch (e) {
            console.error('Failed to decode token', e);
            set({ accessToken: null, user: null, isAuthenticated: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            // Using direct fetch for login/register to avoid circular dependency or if special handling is needed,
            // but apiFetch is better for consistency. Let's use apiFetch but handle the response manually if needed.
            // Actually, let's just use direct fetch but fix the URL logic once and for all.
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            const { accessToken } = data;
            const decodedUser = jwtDecode<User>(accessToken);

            set({
                accessToken,
                user: decodedUser,
                isAuthenticated: true,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true });
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            const { accessToken } = data;
            const decodedUser = jwtDecode<User>(accessToken);

            set({
                accessToken,
                user: decodedUser,
                isAuthenticated: true,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout fetch failed', error);
        } finally {
            set({
                accessToken: null,
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    },
}));

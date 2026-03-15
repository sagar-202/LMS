'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { isAuthenticated, logout, user, initializeAuth, isInitialized } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    // Do not show header on auth pages
    const isAuthPage = pathname.startsWith('/auth');

    React.useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        router.push('/auth/login');
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <div className="flex flex-col min-h-screen font-sans transition-colors duration-300 bg-white dark:bg-gray-900">
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand / Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-300">
                                    V
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                    VibeLMS
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-10">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Courses', href: '/courses' },
                                { name: 'Dashboard', href: '/dashboard' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-black uppercase tracking-widest transition-all ${pathname === item.href ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Actions */}
                        <div className="flex items-center gap-6">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all border border-gray-100 dark:border-gray-800 hover:scale-110 active:scale-95 shadow-sm"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </button>

                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 font-black text-sm shadow-inner overflow-hidden border border-gray-100 dark:border-gray-800">
                                            {initials}
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                                            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-800 py-4 z-20 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                                                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 mb-2">
                                                    <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.email}</p>
                                                </div>
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Dashboard
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center justify-start gap-3 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 active:scale-95 transition-colors rounded-none"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    href="/auth/login"
                                    variant="primary"
                                    size="sm"
                                    className="px-8 py-3"
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

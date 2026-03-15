'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { isAuthenticated, logout, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    // Do not show header on auth pages
    const isAuthPage = pathname.startsWith('/auth');

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        router.push('/auth/login');
    };

    if (isAuthPage) {
        return <>{children}</>;
    }

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-gray-900 font-sans">
            <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand / Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-all duration-300">
                                    V
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors">
                                    VibeLMS
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-10">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Courses', href: '/#curriculum' },
                                { name: 'Dashboard', href: '/profile' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-black uppercase tracking-widest transition-all ${pathname === item.href ? 'text-blue-600' : 'text-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Actions */}
                        <div className="flex items-center gap-6">
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600 font-black text-sm shadow-inner overflow-hidden border border-gray-100">
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
                                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-4 z-20 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
                                                <div className="px-6 py-4 border-b border-gray-50 mb-2">
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="px-8 py-3 bg-gray-900 text-white text-sm font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 hover:shadow-blue-500/20 active:scale-95"
                                >
                                    Sign In
                                </Link>
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

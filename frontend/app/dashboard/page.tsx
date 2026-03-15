'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
    const { isAuthenticated, loading, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!loading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, loading, router]);

    // Show loading state while determining auth status
    if (loading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Verifying Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Learning Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.name}</span>! Ready for your next lesson?
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Completion</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">85%</p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-blue-600 w-[85%] rounded-full shadow-lg shadow-blue-500/20"></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Time Spent</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">24h</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">Focused learning this month</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Certificates</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">3</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">Earned in your profile</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Recent Activity</h2>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-6 p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black">
                                        {i}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-bold">Python for Data Science</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Lesson 4: Data Structures</p>
                                    </div>
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        2h ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

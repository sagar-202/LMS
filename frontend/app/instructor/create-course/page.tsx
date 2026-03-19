'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { lmsApi } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function CreateCoursePage() {
    const { isAuthenticated, user, loading: authLoading } = useAuthStore();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        difficulty: 'Beginner',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!authLoading && (!isAuthenticated || (user?.role !== 'instructor' && user?.role !== 'admin'))) {
            router.push('/');
        }
    }, [isAuthenticated, user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await lmsApi.createCourse(formData);
            router.push(`/instructor/dashboard`);
        } catch (err: any) {
            setError(err.message || 'Failed to create course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <Button href="/instructor/dashboard" variant="outline" size="sm" className="mb-8 group">
                        <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to CMS
                    </Button>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">Create New Course</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Define the core identity of your new tech program.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl shadow-blue-500/5">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Course Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                            placeholder="e.g., Advanced System Design"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                            placeholder="What will students learn in this course?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-bold"
                            >
                                <option>Development</option>
                                <option>Design</option>
                                <option>Business</option>
                                <option>Data Science</option>
                                <option>DevOps</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-bold"
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button type="submit" variant="primary" size="xl" className="w-full rounded-[2rem] shadow-xl shadow-blue-500/20" disabled={loading}>
                            {loading ? 'Creating Program...' : 'Initialize Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

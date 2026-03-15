'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

import { lmsApi, Subject, SubjectProgress } from '@/lib/api';
import Link from 'next/link';

interface SubjectWithProgress extends Subject {
    progress?: SubjectProgress;
}

export default function DashboardPage() {
    const { isAuthenticated, loading: authLoading, user } = useAuthStore();
    const router = useRouter();

    const [subjectsWithProgress, setSubjectsWithProgress] = React.useState<SubjectWithProgress[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            try {
                const subjects = await lmsApi.getSubjects();
                const progressPromises = subjects.map(async (s) => {
                    try {
                        const p = await lmsApi.getSubjectProgress(s.id);
                        return { ...s, progress: p };
                    } catch {
                        return { ...s, progress: { total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null } };
                    }
                });
                const results = await Promise.all(progressPromises);
                setSubjectsWithProgress(results);
            } catch (err) {
                console.error('Failed to fetch dashboard progress:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    // Analytics Calculations
    const activeCourses = subjectsWithProgress.filter(s => (s.progress?.percent_complete || 0) > 0 && (s.progress?.percent_complete || 0) < 100);
    const coursesInProgress = activeCourses.length;
    const lessonsCompleted = subjectsWithProgress.reduce((acc, s) => acc + (s.progress?.completed_videos || 0), 0);
    const totalLessonsAvailable = subjectsWithProgress.reduce((acc, s) => acc + (s.progress?.total_videos || 0), 0);
    const overallCompletion = totalLessonsAvailable > 0 ? Math.round((lessonsCompleted / totalLessonsAvailable) * 100) : 0;

    // Continue Learning (Recent Active)
    const continueLearningSubject = activeCourses.sort((a, b) => (b.id - a.id))[0];

    // Show loading state while determining auth status or fetching data
    if (authLoading || (isAuthenticated && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing your progress...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
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
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Completion</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{overallCompletion}%</p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-1000"
                                style={{ width: `${overallCompletion}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Courses Active</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{coursesInProgress}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">In the middle of learning</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Lessons Done</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{lessonsCompleted}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">Out of {totalLessonsAvailable} total</p>
                    </div>
                </div>

                {/* Continue Learning Section */}
                {continueLearningSubject && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Active Learning</h2>
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-xl dark:shadow-none flex flex-col md:flex-row items-center gap-10">
                            <div className="w-full md:w-1/4 aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={continueLearningSubject.thumbnail || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop'}
                                    alt={continueLearningSubject.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">RESUME</span>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{continueLearningSubject.title}</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                        <span>Progress</span>
                                        <span>{continueLearningSubject.progress?.percent_complete}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full transition-all duration-1000"
                                            style={{ width: `${continueLearningSubject.progress?.percent_complete}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <Link
                                    href={continueLearningSubject.progress?.last_video_id
                                        ? `/subjects/${continueLearningSubject.id}/video/${continueLearningSubject.progress.last_video_id}`
                                        : `/subjects/${continueLearningSubject.id}`}
                                    className="inline-flex px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all text-sm"
                                >
                                    Continue Watching
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                <div className="bg-white dark:bg-gray-900 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Recent Activity</h2>
                        <div className="space-y-6">
                            {subjectsWithProgress.filter(s => (s.progress?.completed_videos || 0) > 0).slice(0, 5).map((subject) => (
                                <div key={subject.id} className="flex items-center gap-6 p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-black">
                                        {subject.progress?.percent_complete}%
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-bold">{subject.title}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{subject.progress?.completed_videos} lessons completed</p>
                                    </div>
                                    <Link
                                        href={`/subjects/${subject.id}`}
                                        className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline"
                                    >
                                        Details
                                    </Link>
                                </div>
                            ))}

                            {subjectsWithProgress.filter(s => (s.progress?.completed_videos || 0) > 0).length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No activity yet. Start your first lesson today!</p>
                                    <Link href="/#curriculum" className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mt-4 inline-block hover:underline">Browse Courses</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

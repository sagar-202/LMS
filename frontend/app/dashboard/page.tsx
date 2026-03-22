'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

import { lmsApi, Subject, SubjectProgress, LastWatchedProgress, OverallStats } from '@/lib/api';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getYoutubeThumbnail } from '@/lib/youtube';
import ProgressRing from '@/components/ui/ProgressRing';
import CertificateViewer from '@/components/features/CertificateViewer';

interface SubjectWithProgress extends Subject {
    progress?: SubjectProgress;
}

export default function DashboardPage() {
    const { isAuthenticated, loading: authLoading, user } = useAuthStore();
    const router = useRouter();

    const [subjectsWithProgress, setSubjectsWithProgress] = React.useState<SubjectWithProgress[]>([]);
    const [lastWatched, setLastWatched] = React.useState<LastWatchedProgress | null>(null);
    const [overallStats, setOverallStats] = React.useState<OverallStats>({ completed_lessons: 0, total_lessons: 0 });
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
                const [subjects, enrollmentData, lastWatchedData, statsData] = await Promise.all([
                    lmsApi.getSubjects(),
                    lmsApi.getEnrollments(),
                    lmsApi.getLastWatched(),
                    lmsApi.getOverallStats()
                ]);
                
                console.log('Dashboard Data Response:', { subjects, enrollmentData, lastWatchedData, statsData });
                console.log('Setting Overall Stats:', statsData);
                
                setOverallStats(statsData);
                setLastWatched(lastWatchedData);
                
                const enrollmentIds = enrollmentData.data || [];

                // Filter subjects to only those the user is enrolled in
                const enrolledSubjects = subjects.filter((s: Subject) => enrollmentIds.includes(s.id));

                const progressPromises = enrolledSubjects.map(async (s: Subject) => {
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
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchDashboardData();
        }
    }, [isAuthenticated]);

    // Analytics Calculations
    const activeCourses = subjectsWithProgress.filter(s => (s.progress?.percent_complete || 0) < 100);
    const coursesInProgress = activeCourses.length;
    const lessonsCompleted = overallStats.completed_lessons;
    const totalLessonsAvailable = overallStats.total_lessons;
    
    const enrolledCount = subjectsWithProgress.length;
    const totalPercent = subjectsWithProgress.reduce((acc, s) => acc + (s.progress?.percent_complete || 0), 0);
    const overallCompletion = enrolledCount > 0 ? Math.round(totalPercent / enrolledCount) : 0;

    // Continue Learning (Recent Active)
    // const continueLearningSubject = activeCourses.sort((a, b) => (b.id - a.id))[0]; // Removed unused constant

    // Show loading state while determining auth status or fetching data
    if (authLoading || (isAuthenticated && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing your progress...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        Learning Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.name}</span>! Ready for your next lesson?
                    </p>
                </header>

                <div className="opacity-0 translate-y-4 animate-[fadeIn_0.6s_ease_forwards]">
                    {/* Continue Learning Section */}
                {lastWatched && (
                    <section className="mb-12">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                            Continue Learning
                        </h2>
                        {(() => {
                            const currentSubject = subjectsWithProgress.find(s => s.id === lastWatched.subject_id);
                            const percent = currentSubject?.progress?.percent_complete || 0;
                            
                            return (
                                <div 
                                    onClick={() => router.push(`/subjects/${lastWatched.subject_id}/video/${lastWatched.video_id}`)}
                                    className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-8 flex-1 w-full">
                                        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 flex-shrink-0">
                                            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1 leading-tight">{lastWatched.subject_title}</h3>
                                                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest">{lastWatched.video_title}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
                                                        Lesson {lastWatched.lesson_number} of {lastWatched.total_lessons}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                    <span>Course Progress</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="primary" 
                                        size="lg"
                                        className="flex items-center gap-3 px-10 flex-shrink-0"
                                    >
                                        Resume
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </Button>
                                </div>
                            );
                        })()}
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Completion</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{overallCompletion}%</p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-1000"
                                style={{ width: `${overallCompletion}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Courses Active</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{coursesInProgress}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">In the middle of learning</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl dark:shadow-none hover:shadow-blue-500/5 transition-all">
                        <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Lessons Done</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white">{lessonsCompleted} out of {totalLessonsAvailable} total</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium">From your enrolled courses</p>
                    </div>
                </div>

                {/* Active Learning Section */}
                {subjectsWithProgress.length > 0 ? (
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Active Learning</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subjectsWithProgress.map((course) => {
                                const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
                                const rawThumb = course?.thumbnail_url || course?.thumbnail;
                                const fallbackThumb = getYoutubeThumbnail(course?.youtube_url) || '/placeholder-course.jpg';
                                
                                const thumbnail = rawThumb 
                                    ? (rawThumb.startsWith('http') || rawThumb.startsWith('data:') ? rawThumb : `${API_BASE_URL}/uploads/${rawThumb.startsWith('/') ? rawThumb.slice(1) : rawThumb}`)
                                    : fallbackThumb;

                                return (
                                <div 
                                    key={course.id} 
                                    onClick={() => router.push(course.progress?.last_video_id ? `/subjects/${course.id}/video/${course.progress.last_video_id}` : `/subjects/${course.id}`)}
                                    className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-6 shadow-xl transition-all duration-300 flex flex-col gap-6 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)] hover:ring-2 hover:ring-blue-500/40 hover:border-blue-500"
                                >
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={thumbnail || 'https://placehold.co/800x450/2563eb/ffffff?text=Course+Thumbnail'}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-1 rounded-full shadow-lg">
                                            <ProgressRing percentage={course.progress?.percent_complete || 0} size={40} strokeWidth={3} />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{course.title}</h3>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4 font-bold">
                                            <span>{course.difficulty}</span>
                                            <span>•</span>
                                            <span>{course.lessons_count} Lessons</span>
                                        </div>
                                        <div className="space-y-3 mb-6 flex-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                <span>Progress</span>
                                                <span>{course.progress?.percent_complete || 0}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-blue-600 h-full transition-all duration-1000"
                                                    style={{ width: `${course.progress?.percent_complete || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <Link
                                            href={course.progress?.last_video_id
                                                ? `/subjects/${course.id}/video/${course.progress.last_video_id}`
                                                : `/subjects/${course.id}`}
                                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl px-6 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-200 active:scale-95 text-sm flex items-center gap-2 justify-center"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                            Continue Learning
                                        </Link>
                                        {course.progress?.percent_complete === 100 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const btn = e.currentTarget;
                                                    btn.innerText = 'Generating...';
                                                    btn.disabled = true;
                                                    lmsApi.generateCertificate(course.id)
                                                        .then(() => {
                                                            alert('Certificate generated successfully! Refresh to see it in your Certificates panel.');
                                                            window.location.reload();
                                                        })
                                                        .catch(err => {
                                                            alert('Failed to generate certificate: ' + err.message);
                                                            btn.innerText = 'Generate Certificate';
                                                            btn.disabled = false;
                                                        });
                                                }}
                                                className="w-full mt-3 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl px-6 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg transition-all duration-200 active:scale-95 text-sm flex items-center gap-2 justify-center"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                                Generate Certificate
                                            </button>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </section>
                ) : (
                    <section className="mb-12">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Active Learning</h2>
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-12 shadow-xl dark:shadow-none text-center">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">You haven&apos;t enrolled in any courses yet.</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-sm mx-auto">Explore our range of modern tech skills and start your first lesson today.</p>
                            <Link
                                href="/courses"
                                className="inline-flex px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </section>
                )}

                </div>

                {/* Achievement Section */}
                <div className="mt-12">
                    <CertificateViewer />
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { lmsApi, Subject, SubjectProgress } from '@/lib/api';
import AuthGuard from '@/components/Auth/AuthGuard';

interface EnrolledSubject extends Subject {
    progress: SubjectProgress | null;
}

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Get all subjects
                const subjects = await lmsApi.getSubjects();

                // 2. Fetch progress for each subject in parallel
                const subjectsWithProgress = await Promise.all(
                    subjects.map(async (subject) => {
                        try {
                            const progress = await lmsApi.getSubjectProgress(subject.id);
                            return { ...subject, progress };
                        } catch (err) {
                            console.error(`Failed to fetch progress for subject ${subject.id}`, err);
                            return { ...subject, progress: null };
                        }
                    })
                );

                // Filter to only show subjects the user has actually started/interacted with
                const enrolled = subjectsWithProgress.filter(s =>
                    s.progress && (s.progress.completed_videos > 0 || s.progress.last_video_id !== null)
                );

                setEnrolledSubjects(enrolled);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push('/auth/login');
    };

    if (!user) return null;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Summary Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 lg:p-12 mb-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 z-0 opacity-50 transition-transform hover:scale-110 duration-700"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black shadow-xl transform rotate-1">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{user.name}</h1>
                                <p className="text-gray-500 font-medium">{user.email}</p>
                            </div>

                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-center flex-1 md:flex-none">
                                    <p className="text-2xl font-black text-gray-900 leading-none">{enrolledSubjects.length}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Courses</p>
                                </div>
                                <div className="bg-blue-600 px-6 py-4 rounded-2xl text-center shadow-lg shadow-blue-100 text-white flex-1 md:flex-none">
                                    <p className="text-2xl font-black leading-none">
                                        {enrolledSubjects.reduce((acc, sub) => acc + (sub.progress?.completed_videos || 0), 0)}
                                    </p>
                                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Lessons</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enrolled Subjects */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-black text-gray-900">My Courses</h2>
                        <Link href="/" className="text-sm font-bold text-blue-600 hover:text-black transition-colors">
                            Explore All Courses →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] h-72 animate-pulse border border-gray-100 shadow-sm"></div>
                            ))}
                        </div>
                    ) : enrolledSubjects.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl shadow-blue-500/5">
                            <div className="text-7xl mb-8 leading-none">🚀</div>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your learning journey starts here</h3>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                                You haven't started any courses yet. Discover our top-rated lessons and master new skills.
                            </p>
                            <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-1 active:translate-y-0">
                                Browse Courses
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {enrolledSubjects.map((subject) => (
                                <div key={subject.id} className="group bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col transform hover:-translate-y-1">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-8">
                                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight pr-4 tracking-tight">
                                                {subject.title}
                                            </h3>
                                            <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl text-sm font-black uppercase tracking-wider shadow-sm border border-blue-100/50">
                                                {subject.progress?.percent_complete || 0}%
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-base mb-10 line-clamp-2 leading-relaxed font-medium">
                                            {subject.description || 'Master the core concepts and gain practical experience in this comprehensive course.'}
                                        </p>

                                        {/* Progress Section */}
                                        <div className="mb-10">
                                            <div className="flex items-center justify-between text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">
                                                <span>Your Progress</span>
                                                <span className="text-gray-900 px-3 py-1 bg-gray-50 rounded-lg">
                                                    {subject.progress?.completed_videos || 0} / {subject.progress?.total_videos || 0} Lessons
                                                </span>
                                            </div>
                                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-100/50">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg transition-all duration-1000 ease-out relative"
                                                    style={{ width: `${subject.progress?.percent_complete || 0}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse transition-opacity"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={subject.progress?.last_video_id
                                            ? `/subjects/${subject.id}/video/${subject.progress.last_video_id}`
                                            : `/subjects/${subject.id}`}
                                        className="w-full py-5 bg-gray-900 text-white text-center font-black rounded-2xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 group/btn"
                                    >
                                        <span>Continue Learning</span>
                                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}

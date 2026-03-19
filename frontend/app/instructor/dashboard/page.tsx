'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { lmsApi, Subject } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function InstructorDashboard() {
    const { isAuthenticated, user, loading: authLoading } = useAuthStore();
    const router = useRouter();
    const [courses, setCourses] = React.useState<Subject[]>([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || (user?.role !== 'instructor' && user?.role !== 'admin'))) {
            router.push('/');
        }
    }, [isAuthenticated, user, authLoading, router]);

    useEffect(() => {
        const fetchInstructorData = async () => {
            if (!isAuthenticated) return;
            try {
                const data = await lmsApi.getInstructorDashboard();
                setCourses(data);
            } catch (err) {
                console.error('Failed to fetch instructor dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && (user?.role === 'instructor' || user?.role === 'admin')) {
            fetchInstructorData();
        }
    }, [isAuthenticated, user]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Instructor CMS</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Manage your curriculum and track course performance.</p>
                    </div>
                    <Button href="/instructor/create-course" variant="primary" size="lg" className="rounded-2xl shadow-xl shadow-blue-500/20 px-8">
                        Create New Course
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-800">
                                        {course.category}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${course.is_published ? 'text-green-500' : 'text-amber-500'}`}>
                                        {course.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{course.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6">{course.description}</p>
                                
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                                    <span>{course.lessons_count || 0} Lessons</span>
                                    <span>•</span>
                                    <span>{course.difficulty}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button href={`/instructor/courses/${course.id}/lessons`} variant="outline" size="sm" className="w-full text-xs">
                                        Edit Lessons
                                    </Button>
                                    <Button href={`/subjects/${course.id}`} variant="outline" size="sm" className="w-full text-xs">
                                        View Public
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">Start your journey by creating your first tech course.</p>
                            <Button href="/instructor/create-course" variant="primary" size="lg">Create Course</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

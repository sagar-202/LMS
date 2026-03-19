'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { lmsApi, SubjectTree } from '@/lib/api';
import Button from '@/components/ui/Button';

export default function EditLessonsPage() {
    const { isAuthenticated, user, loading: authLoading } = useAuthStore();
    const router = useRouter();
    const { id } = useParams();
    const subjectId = Array.isArray(id) ? id[0] : id;

    const [courseTree, setCourseTree] = useState<SubjectTree | null>(null);
    const [loading, setLoading] = useState(true);
    const [lessonData, setLessonData] = useState({
        title: '',
        youtube_video_id: '',
        description: '',
        sectionTitle: 'Main Curriculum', // Simple default
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || (user?.role !== 'instructor' && user?.role !== 'admin'))) {
            router.push('/');
        }
    }, [isAuthenticated, user, authLoading, router]);

    const fetchCourseStructure = React.useCallback(async () => {
        if (!subjectId) return;
        try {
            const tree = await lmsApi.getSubjectTree(subjectId);
            setCourseTree(tree);
        } catch (err) {
            console.error('Failed to fetch course structure:', err);
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        if (isAuthenticated && subjectId) {
            fetchCourseStructure();
        }
    }, [isAuthenticated, subjectId, fetchCourseStructure]);

    const handleAddLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectId) return;
        setSubmitting(true);

        try {
            await lmsApi.addLesson(subjectId, lessonData.sectionTitle, {
                title: lessonData.title,
                youtube_video_id: lessonData.youtube_video_id,
                description: lessonData.description,
                order_index: (courseTree?.sections[0]?.videos.length || 0) + 1
            });
            // Reset form and refresh tree
            setLessonData({ ...lessonData, title: '', youtube_video_id: '', description: '' });
            await fetchCourseStructure();
        } catch (err) {
            console.error('Failed to add lesson:', err);
            window.alert('Failed to add lesson. Ensure you are the instructor of this course.');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 transition-colors">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <Button href="/instructor/dashboard" variant="outline" size="sm" className="mb-6 group">
                            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to CMS
                        </Button>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Manage Curriculum</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{courseTree?.title}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Add Lesson Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 sticky top-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 tracking-tight uppercase tracking-widest text-sm">Add New Lesson</h2>
                            <form onSubmit={handleAddLesson} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Lesson Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={lessonData.title}
                                        onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                        placeholder="Introduction to..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">YouTube Video ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={lessonData.youtube_video_id}
                                        onChange={(e) => setLessonData({ ...lessonData, youtube_video_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                        placeholder="e.g., W6NZfCO5SIk"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Section Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={lessonData.sectionTitle}
                                        onChange={(e) => setLessonData({ ...lessonData, sectionTitle: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                    />
                                </div>
                                <Button type="submit" variant="primary" size="lg" className="w-full rounded-2xl" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Lesson'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right: Current Tree */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-blue-500/5 min-h-[500px]">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-10 tracking-tight uppercase tracking-widest text-sm">Course Structure</h2>
                            
                            {courseTree?.sections && courseTree.sections.length > 0 ? (
                                <div className="space-y-10">
                                    {courseTree.sections.map((section) => (
                                        <div key={section.id}>
                                            <h3 className="text-lg font-black text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-3">
                                                <span className="w-6 h-1 bg-blue-600/20 rounded-full"></span>
                                                {section.title}
                                            </h3>
                                            <div className="space-y-3 pl-9 border-l-2 border-gray-50 dark:border-gray-700">
                                                {section.videos.map((video) => (
                                                    <div key={video.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                {video.order_index}
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{video.title}</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{video.id}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No lessons added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

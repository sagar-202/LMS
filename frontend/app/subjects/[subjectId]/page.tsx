'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { lmsApi, SubjectTree, SubjectProgress } from '@/lib/api';

export default function SubjectDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;

    const [tree, setTree] = useState<SubjectTree | null>(null);
    const [progress, setProgress] = useState<SubjectProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!subjectId) return;

        const autoRedirect = async () => {
            setLoading(true);
            try {
                // Determine where to start/resume
                const { video_id } = await lmsApi.getSmartResumeVideo(subjectId);
                router.push(`/subjects/${subjectId}/video/${video_id}`);
            } catch (err) {
                console.error('Failed to auto-navigate to lesson:', err);
                // If auto-redirect fails, fallback to loading the overview page data
                Promise.all([
                    lmsApi.getSubjectTree(subjectId),
                    lmsApi.getSubjectProgress(subjectId)
                ])
                    .then(([treeData, progressData]) => {
                        setTree(treeData);
                        setProgress(progressData);
                    })
                    .catch(fetchErr => {
                        setError(fetchErr.message || 'Failed to load course details.');
                    })
                    .finally(() => setLoading(false));
            }
        };

        autoRedirect();
    }, [subjectId, router]);

    const handleAction = () => {
        if (!tree) return;

        // If progress exists and has a last_video_id, continue from there
        if (progress && progress.last_video_id) {
            router.push(`/subjects/${subjectId}/video/${progress.last_video_id}`);
            return;
        }

        // Otherwise, find the first unlocked video
        const firstVideo = tree.sections
            .flatMap(s => s.videos)
            .find(v => !v.locked);

        if (firstVideo) {
            router.push(`/subjects/${subjectId}/video/${firstVideo.id}`);
        } else {
            // Fallback if somehow everything is locked or no videos
            alert('No lessons available to start.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-transparent dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !tree) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center bg-transparent dark:bg-gray-950">
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-8 rounded-2xl border border-red-100 dark:border-red-900/50">
                    <p className="font-bold text-xl mb-4">Error Loading Course</p>
                    <p className="text-lg">{error || 'Course details not found.'}</p>
                    <Link
                        href="/"
                        className="mt-8 inline-block font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-8 py-3 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const totalSections = tree.sections.length;
    const totalLessons = tree.lessons_count || progress?.total_videos || tree.sections.reduce((acc, s) => acc + s.videos.length, 0);
    const percent = progress?.percent_complete || 0;
    const hasStarted = progress && progress.completed_videos > 0;

    return (
        <div className="min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
            <div className="max-w-5xl mx-auto p-6 lg:p-12">
                {/* Header / Breadcrumb */}
                <nav className="flex items-center gap-2 mb-10 text-sm font-medium text-gray-400 dark:text-gray-500">
                    <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                    <span className="text-gray-300 dark:text-gray-800">/</span>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{tree.title}</span>
                </nav>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Course Details */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                                {tree.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed font-medium max-w-2xl border-l-4 border-blue-500 pl-8 py-2">
                                {tree.description || 'Embark on a comprehensive learning journey designed to master this subject from scratch.'}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest font-black mb-1">Sections</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{totalSections}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest font-black mb-1">Lessons</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{totalLessons}</p>
                            </div>
                        </div>

                        {/* Section List (Brief Overview) */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Curriculum</h2>
                            <div className="space-y-4">
                                {tree.sections.map((section, idx) => (
                                    <div key={section.id} className="flex items-center gap-6 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-50 dark:border-gray-800 shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-black rounded-xl text-sm italic">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{section.title}</h3>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{section.videos.length} lessons</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sticky Progress/Action Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-12 bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl dark:shadow-none shadow-blue-500/10 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="relative w-32 h-32 mb-8">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        className="text-gray-50 dark:text-gray-800"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (364 * percent) / 100}
                                        className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white">{percent}%</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                                {hasStarted ? 'Almost there!' : 'Not started yet'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-10 leading-relaxed px-4">
                                {hasStarted
                                    ? `You've completed ${progress?.completed_videos} out of ${totalLessons} lessons.`
                                    : 'Start your journey today and master this course through interactive lessons.'
                                }
                            </p>

                            <Button
                                onClick={handleAction}
                                variant="primary"
                                size="lg"
                                className="w-full"
                            >
                                {hasStarted ? 'Continue Learning' : 'Start Learning'}
                            </Button>

                            <p className="mt-6 text-xs font-black uppercase tracking-widest text-gray-300 dark:text-gray-700">
                                Professional Certificate
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

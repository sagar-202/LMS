'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { lmsApi, VideoDetail } from '@/lib/api';
import VideoPlayer from '@/components/Video/VideoPlayer';
import { sendProgress, markVideoCompleted } from '@/lib/progress';
import { useSidebarStore } from '@/store/sidebarStore';

export default function VideoLessonPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;
    const videoId = params.videoId as string;

    const { markVideoCompleted: markSidebarCompleted } = useSidebarStore();

    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [startPosition, setStartPosition] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completionMessage, setCompletionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!videoId) return;

        setLoading(true);
        setError(null);

        // Fetch video details and student progress in parallel
        Promise.all([
            lmsApi.getVideo(videoId),
            lmsApi.getVideoProgress(videoId).catch(() => ({ last_position_seconds: 0, is_completed: false }))
        ])
            .then(([videoData, progressData]) => {
                setVideo(videoData);

                // Resume logic: If last_position_seconds > 5s, start 3s earlier for context
                if (progressData && typeof progressData.last_position_seconds === 'number') {
                    const lastPos = progressData.last_position_seconds;
                    const resumePos = lastPos > 5 ? lastPos - 3 : lastPos;
                    setStartPosition(resumePos);

                    if (resumePos > 0) {
                        console.log(`Resume Playback: Starting at ${resumePos}s (Last saved: ${lastPos}s)`);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to load lesson data:', err);
                setError(err.message || 'Failed to load lesson content.');
            })
            .finally(() => {
                // Ensure a small delay if needed or just set loading false
                setLoading(false);
            });
    }, [videoId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !video) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
                    <p className="font-bold text-lg mb-2">Error Loading Lesson</p>
                    <p>{error || 'The requested lesson could not be found.'}</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 text-sm font-semibold text-red-700 bg-red-100 px-6 py-2 rounded-xl border border-red-200 hover:bg-red-200 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (video.locked) {
        return (
            <div className="max-w-4xl mx-auto p-12 text-center">
                <div className="bg-gray-50 border border-gray-200 p-12 rounded-3xl">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                        This lesson is locked. Complete the previous video to unlock this lesson.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="text-sm font-semibold text-gray-700 bg-white border border-gray-300 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10">
            {/* Top Section: Breadcrumb */}
            <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-400">
                <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <Link href={`/subjects/${subjectId}`} className="hover:text-blue-500 transition-colors text-gray-500">Course</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-800 font-semibold truncate max-w-[200px]">{video.title}</span>
            </nav>

            {/* Main Section: Video Player */}
            <div className="relative bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-black/5 ring-offset-4 ring-offset-white mb-10 group">
                <div className="aspect-video w-full">
                    <VideoPlayer
                        videoId={video.id}
                        youtubeVideoId={video.youtube_video_id}
                        startPositionSeconds={startPosition}
                        onProgress={(seconds) => {
                            sendProgress(video.id, seconds);
                        }}
                        onCompleted={() => {
                            markVideoCompleted(video.id, video.duration_seconds);
                            markSidebarCompleted(video.id);

                            if (video.next_video_id) {
                                setCompletionMessage('Lesson completed. Loading next lesson...');
                                setTimeout(() => {
                                    router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
                                }, 2000);
                            } else {
                                setCompletionMessage('You completed this subject.');
                            }
                        }}
                    />
                </div>

                {completionMessage && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all animate-in fade-in">
                        <div className="bg-white/95 border border-white/20 p-8 rounded-[2rem] shadow-2xl text-center transform animate-in zoom-in duration-300">
                            <div className="text-5xl mb-4">✨</div>
                            <p className="text-2xl font-black text-gray-900 mb-2">{completionMessage}</p>
                            {video.next_video_id && (
                                <div className="mt-4 flex justify-center">
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 animate-progress-fast"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Below Video: Title and Description */}
            <div className="mb-10 px-2 lg:px-4">
                <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                    {video.title}
                </h1>
                <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                        {video.description || 'No description provided for this lesson.'}
                    </p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-gray-100 mb-24 lg:mb-32">
                <div className="w-full sm:w-auto">
                    {video.previous_video_id ? (
                        <Link
                            href={`/subjects/${subjectId}/video/${video.previous_video_id}`}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all border border-gray-200 w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous Lesson
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="px-8 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl border border-gray-100 cursor-not-allowed opacity-50 w-full sm:w-auto flex items-center gap-3 justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous Lesson
                        </button>
                    )}
                </div>

                <div className="w-full sm:w-auto text-center hidden lg:block">
                    <span className="text-xs uppercase tracking-widest font-black text-gray-300">End of Lesson</span>
                </div>

                <div className="w-full sm:w-auto">
                    {video.next_video_id ? (
                        <Link
                            href={`/subjects/${subjectId}/video/${video.next_video_id}`}
                            className="group flex items-center gap-3 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-black transition-all w-full sm:w-auto justify-center shadow-lg hover:shadow-blue-500/20"
                        >
                            Next Lesson
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="group flex items-center gap-3 px-10 py-4 bg-green-50 text-green-700 font-black rounded-2xl border border-green-100 w-full sm:w-auto justify-center cursor-default"
                        >
                            ✨ Course Completed!
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VideoMeta from '@/components/VideoMeta';
import VideoProgressBar from '@/components/VideoProgressBar';
import { lmsApi, VideoDetail, VideoProgress } from '@/lib/api';

function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function VideoLessonPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;
    const videoId = params.videoId as string;

    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [progress, setProgress] = useState<VideoProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!videoId) return;

        Promise.all([
            lmsApi.getVideo(videoId).catch(() => null),
            lmsApi.getVideoProgress(videoId).catch(() => null)
        ]).then(([videoData, progressData]) => {
            setVideo(videoData);
            setProgress(progressData);
            setLoading(false);
        });
    }, [videoId]);

    const updateProgressApi = useCallback((seconds: number, completed: boolean = false) => {
        if (!videoId) return;
        lmsApi.updateVideoProgress(videoId, {
            last_position_seconds: seconds,
            ...(completed && { is_completed: true })
        }).catch(console.error);
    }, [videoId]);

    // Debounced version for the onProgress callback
    const debouncedUpdateProgress = useMemo(
        () => debounce((seconds: number) => {
            updateProgressApi(seconds, false);
        }, 1000),
        [updateProgressApi]
    );

    const handleProgress = (seconds: number) => {
        debouncedUpdateProgress(seconds);
    };

    const handleCompleted = () => {
        if (progress) {
            updateProgressApi(progress.last_position_seconds, true);
        } else {
            updateProgressApi(0, true);
        }
    };

    if (loading) {
        return <div className="p-8 max-w-5xl mx-auto text-center text-gray-500">Loading lesson...</div>;
    }

    if (!video) {
        return (
            <div className="p-8 max-w-5xl mx-auto text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
                <p className="text-gray-600">Video not found, or you need to complete previous lessons first.</p>
                <button
                    onClick={() => router.push(`/subjects/${subjectId}`)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Return to Subject
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => video.previous_video_id && router.push(`/subjects/${subjectId}/video/${video.previous_video_id}`)}
                    disabled={!video.previous_video_id}
                    className={`text-sm font-medium flex items-center gap-2 ${!video.previous_video_id ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    ← Previous Video
                </button>
                <button
                    onClick={() => video.next_video_id && router.push(`/subjects/${subjectId}/video/${video.next_video_id}`)}
                    disabled={!video.next_video_id || video.locked}
                    className={`text-sm font-medium flex items-center gap-2 ${!video.next_video_id || video.locked ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                >
                    Next Video →
                </button>
            </div>

            <VideoPlayer
                youtubeVideoId={video.youtube_video_id}
                startPositionSeconds={progress?.last_position_seconds || 0}
                onProgress={handleProgress}
                onCompleted={handleCompleted}
            />
            <VideoProgressBar />
            <VideoMeta />
        </div>
    );
}

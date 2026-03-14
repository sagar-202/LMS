import VideoPlayer from '@/components/VideoPlayer';
import VideoMeta from '@/components/VideoMeta';
import VideoProgressBar from '@/components/VideoProgressBar';

export default function VideoLessonPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    ← Previous Video
                </button>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    Next Video →
                </button>
            </div>

            <VideoPlayer />
            <VideoProgressBar />
            <VideoMeta />
        </div>
    );
}

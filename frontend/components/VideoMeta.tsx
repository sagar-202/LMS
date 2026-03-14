export default function VideoMeta() {
    return (
        <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Title Placeholder</h1>
            <div className="text-sm border-b border-gray-200 pb-4 mb-4 text-gray-500 flex items-center gap-4">
                <span>Instructor Name</span>
                <span>•</span>
                <span>10:30 minutes</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
                This is a placeholder description for the video. Here we will display the rich text summary or notes about what is covered in this specific lesson.
            </p>
        </div>
    );
}

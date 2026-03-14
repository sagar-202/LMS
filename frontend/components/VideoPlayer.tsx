export default function VideoPlayer() {
    return (
        <div className="w-full aspect-video bg-black flex items-center justify-center rounded-lg shadow-lg overflow-hidden">
            <div className="text-gray-400 flex flex-col items-center">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span className="text-lg font-medium">Video Player Placeholder</span>
            </div>
        </div>
    );
}

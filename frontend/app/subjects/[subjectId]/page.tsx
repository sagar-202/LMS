export default function SubjectDashboardPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900">Welcome to Introduction to Backend Engineering</h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                    Select a section and video from the sidebar to begin learning, or resume where you left off.
                </p>
                <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                    Resume Course
                </button>
            </div>
        </div>
    );
}

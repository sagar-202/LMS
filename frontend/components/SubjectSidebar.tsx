export default function SubjectSidebar() {
    return (
        <aside className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {/* Sections will be mapped here */}
                <div className="text-sm text-gray-500 italic">Sections placeholder</div>
            </nav>
        </aside>
    );
}

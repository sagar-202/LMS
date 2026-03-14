export default function SectionItem() {
    return (
        <div className="border border-gray-200 rounded-md mb-2 overflow-hidden">
            <div className="bg-gray-100 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors">
                <h3 className="font-medium text-gray-700">Section Title Placeholder</h3>
                <span className="text-gray-500 text-sm">▼</span>
            </div>
            <div className="bg-white">
                <ul className="divide-y divide-gray-100">
                    <li className="p-3 text-sm text-gray-600 hover:bg-blue-50 cursor-pointer flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-300"></span>
                        Video Title Placeholder
                    </li>
                </ul>
            </div>
        </div>
    );
}

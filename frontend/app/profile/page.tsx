export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Account Details</h2>
                        <div className="space-y-3 text-gray-600">
                            <p><strong>Name:</strong> John Doe</p>
                            <p><strong>Email:</strong> john@example.com</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Learning Progress</h2>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-blue-800 font-medium">1 Subject Enrolled</p>
                            <p className="text-blue-600 text-sm mt-1">45% total completion</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

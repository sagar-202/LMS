import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Available Subjects</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Subject Card */}
          <Link href="/subjects/1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Introduction to Backend Engineering</h2>
                <p className="text-gray-600 text-sm">Learn the fundamentals of building robust APIs with Node.js.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

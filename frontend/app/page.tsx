'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lmsApi, Subject } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    lmsApi.getSubjects()
      .then(data => {
        setSubjects(data);
        setFilteredSubjects(data);
      })
      .catch(err => console.error('Failed to fetch subjects:', err))
      .finally(() => setLoading(false));
  }, []);

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredSubjects(subjects);
    } else {
      setFilteredSubjects(subjects.filter(s => s.category === category));
    }
  };

  const categories = ['All', 'Frontend', 'Backend', 'Data', 'DevOps'];

  return (
    <main className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
            🚀 The Future of Learning
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            Learn Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tech Skills</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-500 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
            Master programming, backend systems, and AI with structured learning paths designed by industry experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95"
            >
              Browse Courses
            </button>
            <Link
              href="/profile"
              className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 font-black rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              Continue Learning
            </Link>
          </div>
        </div>
      </section>

      <div id="curriculum" className="max-w-7xl mx-auto p-6 lg:p-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                Exploration Curriculum
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => filterByCategory(cat)}
                    className={`px-6 py-2.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                        : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-900'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-100 shadow-sm hidden sm:block">
                <span className="text-gray-500 font-black text-xs uppercase tracking-widest leading-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Showing {filteredSubjects.length} Courses
                </span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-[450px] animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSubjects.map((subject, index) => {
              // Determine difficulty and lessons based on title/index for realism
              const isBeginner = subject.title.toLowerCase().includes('beginner') || subject.title.toLowerCase().includes('fundamentals') || index % 2 === 0;
              const lessonCount = [3, 3, 3, 3, 2, 2, 2, 2][index] || 4; // Use realistic counts for our seeded data
              const thumbKeyword = subject.title.split(' ')[0].toLowerCase();
              const thumbUrl = `https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop`; // High quality tech default

              // More specific placeholders based on course
              const thumbnails: Record<string, string> = {
                'javascript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=600&auto=format&fit=crop',
                'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
                'python': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
                'node.js': 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
                'sql': 'https://images.unsplash.com/photo-1544383023-53fafa015696?q=80&w=600&auto=format&fit=crop',
                'system': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
                'machine': 'https://images.unsplash.com/photo-1555255707-c07966488a7b?q=80&w=600&auto=format&fit=crop',
                'docker': 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?q=80&w=600&auto=format&fit=crop',
              };

              const imageUrl = thumbnails[thumbKeyword] || thumbUrl;

              return (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.id}`}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] transition-all duration-500 flex flex-col transform hover:-translate-y-2"
                >
                  {/* Thumbnail container */}
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={subject.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg ${isBeginner ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                        }`}>
                        {isBeginner ? 'Beginner' : 'Intermediate'}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 flex flex-col flex-1">
                    <h2 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {subject.title}
                    </h2>
                    <p className="text-gray-500 text-base mb-8 flex-1 leading-relaxed line-clamp-2 font-medium">
                      {subject.description || 'Master this subject with our industry-led expert course curriculum.'}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lessonCount} Lessons
                      </div>
                      <div className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                        Go to Course →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-500/5">
            <div className="text-7xl mb-8">🔍</div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">No courses matched your search</h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto">We're constantly adding new skills. Check back soon for exciting updates.</p>
          </div>
        )}
      </div>
    </main>
  );
}

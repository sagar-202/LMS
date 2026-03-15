'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lmsApi, Subject, SubjectProgress } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface SubjectWithProgress extends Subject {
  progress?: SubjectProgress;
}

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsWithProgress, setSubjectsWithProgress] = useState<SubjectWithProgress[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await lmsApi.getSubjects();
        setSubjects(subjectsData);
        setFilteredSubjects(subjectsData);

        if (isAuthenticated) {
          // Fetch progress for all subjects to find the last watched and calculate analytics
          const progressPromises = subjectsData.map(async (s) => {
            try {
              const p = await lmsApi.getSubjectProgress(s.id);
              return { ...s, progress: p };
            } catch {
              return { ...s, progress: { total_videos: 0, completed_videos: 0, percent_complete: 0, last_video_id: null } };
            }
          });
          const results = await Promise.all(progressPromises);
          setSubjectsWithProgress(results);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredSubjects(subjects);
    } else {
      setFilteredSubjects(subjects.filter(s => s.category === category));
    }
  };

  const categories = ['All', 'Frontend', 'Backend', 'Data', 'DevOps'];

  // Analytics Calculations
  const activeCourses = subjectsWithProgress.filter(s => (s.progress?.percent_complete || 0) > 0 && (s.progress?.percent_complete || 0) < 100);
  const coursesInProgress = activeCourses.length;
  const lessonsCompleted = subjectsWithProgress.reduce((acc, s) => acc + (s.progress?.completed_videos || 0), 0);
  const totalLessons = subjectsWithProgress.reduce((acc, s) => acc + (s.progress?.total_videos || 0), 0);

  // Find the most recently active subject
  const continueLearningSubject = activeCourses.sort((a, b) => (b.id - a.id))[0];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12 bg-gray-50/30 dark:bg-gray-950 min-h-screen">
        <div className="h-40 bg-gray-50 dark:bg-gray-900 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-[3rem] animate-pulse"></div>
      </div>
    );
  }

  // Dashboard View for Authenticated Users
  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50/30 dark:bg-gray-950 pb-20 pt-24 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section 1: Welcome Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-2">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Continue building your skills.</p>
          </header>

          {/* Section 2: Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Courses in Progress</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">{coursesInProgress}</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">Active</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Lessons Completed</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">{lessonsCompleted}</span>
                <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 mb-1">Finished</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Total Lessons Available</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">{totalLessons}</span>
                <span className="text-sm font-bold text-gray-400 dark:text-gray-600 mb-1">Total</span>
              </div>
            </div>
          </div>

          {/* Section 3: Continue Learning */}
          {continueLearningSubject && (
            <section className="mb-20">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Continue Learning</h2>
              <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-10 shadow-xl shadow-blue-500/5 dark:shadow-none flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 text-transparent">
                  <img
                    src={`https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop`}
                    alt={continueLearningSubject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">RESUME COURSE</span>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2">{continueLearningSubject.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-2">{continueLearningSubject.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      <span>Course Progress</span>
                      <span className="text-blue-600 dark:text-blue-400">{continueLearningSubject.progress?.percent_complete}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${continueLearningSubject.progress?.percent_complete}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={continueLearningSubject.progress?.last_video_id
                      ? `/subjects/${continueLearningSubject.id}/video/${continueLearningSubject.progress.last_video_id}`
                      : `/subjects/${continueLearningSubject.id}`}
                    className="inline-flex px-10 py-4 bg-blue-600 dark:bg-white dark:text-gray-950 text-white font-black rounded-2xl hover:bg-blue-700 dark:hover:bg-gray-100 transition-all shadow-lg shadow-blue-500/25 dark:shadow-none hover:scale-105 active:scale-95 text-center justify-center min-w-[200px]"
                  >
                    Resume Lesson
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Recommended Courses */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recommended for you</h2>
              <Link href="/courses" className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:underline">View All Curriculum</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {subjects.slice(0, 3).map((subject) => (
                <CourseCard key={subject.id} subject={subject} />
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Landing Page for Guest Users
  return (
    <main className="min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 dark:from-blue-900/10 via-white dark:via-gray-950 to-white dark:to-gray-950 opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
            🚀 The Future of Learning
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
            Learn Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Tech Skills</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
            Master programming, backend systems, and AI with structured learning paths designed by industry experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 dark:bg-white dark:text-gray-950 text-white font-black rounded-2xl hover:bg-blue-700 dark:hover:bg-gray-100 transition-all shadow-xl shadow-blue-500/25 dark:shadow-none hover:scale-105 active:scale-95"
            >
              Browse Courses
            </button>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-black rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all shadow-sm hover:scale-105 active:scale-95 text-center"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </section>

      <div id="curriculum" className="max-w-7xl mx-auto p-6 lg:p-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
                Exploration Curriculum
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => filterByCategory(cat)}
                    className={`px-6 py-2.5 rounded-2xl text-sm font-black tracking-widest uppercase transition-all duration-300 ${activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                      : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hidden sm:block">
                <span className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest leading-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Showing {filteredSubjects.length} Courses
                </span>
              </div>
            </div>
          </div>
        </header>

        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSubjects.map((subject) => (
              <CourseCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5 dark:shadow-none">
            <div className="text-7xl mb-8">🔍</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">No courses matched your search</h3>
            <p className="text-gray-400 dark:text-gray-500 font-medium max-w-sm mx-auto">We're constantly adding new skills. Check back soon for exciting updates.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function CourseCard({ subject }: { subject: Subject }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop';
  const imageUrl = subject.thumbnail || fallbackImage;

  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl dark:shadow-none hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] dark:hover:bg-gray-800 transition-all duration-500 flex flex-col transform hover:-translate-y-2"
    >
      <div className="aspect-video relative overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={subject.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="p-10 flex flex-col flex-1">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {subject.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-8 flex-1 leading-relaxed line-clamp-2 font-medium">
          {subject.description || 'Master this subject with our industry-led expert course curriculum.'}
        </p>
        <div className="flex items-center justify-between pt-8 border-t border-gray-50 dark:border-gray-800">
          <div className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
            Go to Course →
          </div>
        </div>
      </div>
    </Link>
  );
}

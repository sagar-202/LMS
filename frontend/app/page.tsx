'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen bg-transparent dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 dark:from-blue-900/10 via-white dark:via-gray-950 to-white dark:to-gray-950 opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-10 animate-fade-in shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Elevate Your Career
          </div>

          <h1 className="text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05] mb-10">
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-[length:200%_auto] animate-gradient">Future of Tech</span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-14 leading-relaxed">
            Personalized learning paths for software engineers, data scientists, and creators. Build real-world projects with industry-led expert mentorship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-12 py-5 bg-blue-600 dark:bg-white dark:text-gray-950 text-white font-black rounded-2xl hover:bg-blue-700 dark:hover:bg-gray-100 transition-all shadow-2xl shadow-blue-500/30 dark:shadow-none hover:scale-105 active:scale-95 text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-12 py-5 bg-blue-600 dark:bg-white dark:text-gray-950 text-white font-black rounded-2xl hover:bg-blue-700 dark:hover:bg-gray-100 transition-all shadow-2xl shadow-blue-500/30 dark:shadow-none hover:scale-105 active:scale-95 text-lg"
              >
                Get Started Free
              </Link>
            )}
            <Link
              href="/courses"
              className="w-full sm:w-auto px-12 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-black rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all shadow-sm hover:scale-105 active:scale-95 text-center text-lg"
            >
              Explore Curriculum
            </Link>
          </div>

          <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-900 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">15k+</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Active Learners</p>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">4.9/5</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Student Rating</p>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">120+</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Tech Courses</p>
            </div>
            <div>
              <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">100%</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest">Job Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Description Section */}
      <section className="py-32 bg-white dark:bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Designed for Growth</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Our platform combines cutting-edge curriculum with a powerful learning engine to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Expert UI/UX",
                desc: "A beautiful, minimalist dashboard that minimizes distraction and maximizes focus.",
                icon: "🎨",
                color: "blue"
              },
              {
                title: "Cinematic Learning",
                desc: "High-quality video playback with interactive transcripts and lesson tracking.",
                icon: "🎬",
                color: "indigo"
              },
              {
                title: "Dynamic Progress",
                desc: "Real-time synchronization across devices ensures you never lose your place.",
                icon: "⚡",
                color: "emerald"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-400 transition-all duration-500">
                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none flex items-center justify-center text-3xl mb-8 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-600 dark:bg-white rounded-[4rem] p-16 lg:p-24 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-100 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white dark:text-gray-950 mb-8 tracking-tight">
                Ready to transform <br className="hidden md:block" /> your future?
              </h2>
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/register"}
                className="inline-flex px-12 py-5 bg-white dark:bg-blue-600 text-blue-600 dark:text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl text-lg"
              >
                Join the Academy Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-[120px] opacity-20 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 dark:from-blue-900/10 via-white dark:via-gray-900 to-white dark:to-gray-900 opacity-70"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></div>

        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10 opacity-0 translate-y-4 animate-[fadeIn_0.6s_ease_forwards]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100/50 dark:border-blue-800/50 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            Elevate Your Career
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-[length:200%_auto] animate-gradient">Future of Tech</span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Personalized learning paths for software engineers, data scientists, and creators. Build real-world projects with industry-led expert mentorship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href={isAuthenticated ? "/dashboard" : "/auth/register"}
              variant="primary"
              size="xl"
              className="w-full sm:w-auto shadow-2xl shadow-blue-500/30 hover:scale-105 transition-all duration-300"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </Button>
            <Button
              href="/courses"
              variant="outline"
              size="xl"
              className="w-full sm:w-auto hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Explore Curriculum
            </Button>
          </div>

          <div className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800/50 grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="group">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">15k+</p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Learners</p>
            </div>
            <div className="group">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">4.9/5</p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Student Rating</p>
            </div>
            <div className="group">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">120+</p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Tech Courses</p>
            </div>
            <div className="group">
              <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">100%</p>
              <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Job Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Description Section */}
      <section className="py-32 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Designed for Growth</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Our platform combines cutting-edge curriculum with a powerful learning engine to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-gray-50/50 dark:bg-gray-950/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-blue-600 dark:bg-white rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(37,99,235,0.4)] dark:shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 dark:bg-blue-100 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 dark:bg-indigo-100 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black text-white dark:text-gray-950 mb-10 tracking-tight leading-tight">
                Ready to transform <br className="hidden md:block" /> your professional future?
              </h2>
              <Button
                href={isAuthenticated ? "/dashboard" : "/auth/register"}
                variant="white"
                size="xl"
                className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Join the Academy Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

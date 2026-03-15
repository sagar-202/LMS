'use client';

import { useEffect, useState } from 'react';
import { lmsApi, Subject } from '@/lib/api';
import CourseCard from '@/components/Course/CourseCard';

export default function CoursesPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await lmsApi.getSubjects();
                setSubjects(data);
                setFilteredSubjects(data);
            } catch (err) {
                console.error('Failed to fetch subjects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
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

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12 bg-gray-50/30 dark:bg-gray-950 min-h-screen pt-32">
                <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded-3xl animate-pulse w-1/3"></div>
                <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 w-24 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] animate-pulse"></div>)}
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/30 dark:bg-gray-950 pb-20 pt-32 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                Full Curriculum
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-8">
                                Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Craft</span>
                            </h1>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => filterByCategory(cat)}
                                        className={`px-6 py-3 rounded-2xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${activeCategory === cat
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                                            : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hidden sm:block">
                            <span className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest leading-none flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {filteredSubjects.length} Courses Available
                            </span>
                        </div>
                    </div>
                </header>

                {filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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

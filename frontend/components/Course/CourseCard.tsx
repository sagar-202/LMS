'use client';

import React, { useState } from 'react';
import { lmsApi, Subject } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { getYoutubeThumbnail } from '@/lib/youtube';

export default function CourseCard({ 
    subject, 
    isEnrolled = false,
    onEnrollSuccess
}: { 
    subject: Subject, 
    isEnrolled?: boolean,
    onEnrollSuccess?: () => void
}) {
    const router = useRouter();
    const [isEnrolling, setIsEnrolling] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
    
    const getThumbnailUrl = () => {
        if (!subject.thumbnail_url && !subject.thumbnail) {
            // Fallback to youtube thumbnail if existing
            const ytThumb = getYoutubeThumbnail(subject.youtube_url);
            return ytThumb || '/placeholder-course.jpg';
        }
        
        const thumb = subject.thumbnail_url || subject.thumbnail || '';
        if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
        
        const relativeUrl = thumb.startsWith('/') ? thumb.slice(1) : thumb;
        return `${API_BASE_URL}/uploads/${relativeUrl}`;
    };

    const thumbnail = getThumbnailUrl();

    const handleEnroll = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isEnrolled) {
            router.push(`/subjects/${subject.id}`);
            return;
        }

        try {
            setIsEnrolling(true);
            await lmsApi.enrollInSubject(subject.id);
            if (onEnrollSuccess) onEnrollSuccess();
            router.push(`/subjects/${subject.id}`);
        } catch (error) {
            console.error('Enrollment failed:', error);
            alert('Failed to enroll in the course. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    return (
        <div
            onClick={() => router.push(`/subjects/${subject.id}`)}
            className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 cursor-pointer hover:shadow-[0_10px_40px_rgba(59,130,246,0.25)] hover:ring-2 hover:ring-blue-500/40 hover:border-blue-500"
        >
            <div className="aspect-video relative overflow-hidden rounded-t-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={thumbnail || 'https://placehold.co/800x450/2563eb/ffffff?text=Course+Thumbnail'}
                    alt={subject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-10 flex flex-col flex-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {subject.title}
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-3 mb-4 font-bold">
                    <span>{subject.difficulty}</span>
                    <span>•</span>
                    <span>{subject.lessons_count} Lessons</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-base mb-8 flex-1 leading-relaxed line-clamp-2 font-medium">
                    {subject.description || 'Master this subject with our industry-led expert course curriculum.'}
                </p>
                <div className="flex justify-start mt-auto pt-8 border-t border-gray-50 dark:border-gray-800">
                    <button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl px-6 py-3 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 shadow-md shadow-blue-500/10"
                    >
                        {isEnrolled && !isEnrolling && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                        {isEnrolling ? 'Enrolling...' : isEnrolled ? 'Continue Learning' : 'Enroll Course'}
                    </button>
                </div>
            </div>
        </div>
    );
}

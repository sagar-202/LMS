'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Subject } from '@/lib/api';

export default function CourseCard({ subject }: { subject: Subject }) {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [hasError, setHasError] = useState(false);

    // Extract YouTube Video ID and Generate Initial Thumbnail
    const videoId = subject.youtube_url?.split('v=')[1]?.split('&')[0];
    const initialThumb = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';

    useEffect(() => {
        setImgSrc(initialThumb);
    }, [initialThumb]);

    const handleImageError = () => {
        if (!hasError && videoId) {
            setHasError(true);
            setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
    };

    return (
        <Link
            href={`/subjects/${subject.id}`}
            className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl dark:shadow-none hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] dark:hover:bg-gray-800 transition-all duration-500 flex flex-col transform hover:-translate-y-2"
        >
            <div className="aspect-video relative overflow-hidden rounded-t-xl">
                <img
                    src={imgSrc}
                    alt={subject.title}
                    onError={handleImageError}
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

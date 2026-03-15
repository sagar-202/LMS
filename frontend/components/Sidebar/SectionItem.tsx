'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SectionNode } from '@/lib/api';

interface SectionItemProps {
    section: SectionNode;
    subjectId: number | string;
}

export default function SectionItem({ section, subjectId }: SectionItemProps) {
    const params = useParams();
    const currentVideoId = params.videoId;

    return (
        <div className="mb-4">
            <h3 className="px-6 py-2 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                {section.title}
            </h3>
            <ul className="mt-2 space-y-1">
                {section.videos.map((video) => {
                    const isActive = String(video.id) === String(currentVideoId);

                    return (
                        <li key={video.id}>
                            <Link
                                href={`/subjects/${subjectId}/video/${video.id}`}
                                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-4 border-blue-600'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                    } ${video.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                onClick={(e) => {
                                    if (video.locked) e.preventDefault();
                                }}
                            >
                                <span className="flex-shrink-0">
                                    {video.is_completed ? (
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : video.locked ? (
                                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                        </svg>
                                    )}
                                </span>
                                <span className="flex-1 truncate">{video.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

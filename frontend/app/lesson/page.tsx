'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LessonRedirectPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.id;

    useEffect(() => {
        // Current lesson logic is under /subjects/[subjectId]/video/[videoId]
        // If accessed via /lesson/[id], we would ideally fetch the subject mapping 
        // For now, we provide the minimal route shell.
        console.log(`Accessing lesson: ${lessonId}`);
        // router.replace(`/subjects/unknown/video/${lessonId}`);
    }, [lessonId, router]);

    return (
        <div className="max-w-4xl mx-auto p-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Lesson View</h1>
            <p className="text-gray-500">Redirecting to lesson content...</p>
        </div>
    );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;

    useEffect(() => {
        // Since courses are currently managed under /subjects/
        // We redirect to the canonical path for data consistency
        if (courseId) {
            router.replace(`/subjects/${courseId}`);
        }
    }, [courseId, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );
}

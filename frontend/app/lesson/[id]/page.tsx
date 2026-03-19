'use client';

import { useParams } from 'next/navigation';

export default function LessonDetailPage() {
    const params = useParams();
    const id = params.id;

    return (
        <div className="max-w-4xl mx-auto p-12 text-center text-gray-500">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Lesson: {id}</h1>
            <p className="text-lg">Preparing the dynamic learning environment...</p>
            <div className="mt-8 flex justify-center">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-gray-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                                <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

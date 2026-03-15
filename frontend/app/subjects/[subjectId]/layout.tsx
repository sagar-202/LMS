'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';
import AuthGuard from '@/components/Auth/AuthGuard';
import { useSidebarStore } from '@/store/sidebarStore';
import { lmsApi } from '@/lib/api';

export default function SubjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const subjectId = params.subjectId as string;

    const { tree, loading, error, setTree, setProgress, setLoading, setError } = useSidebarStore();

    useEffect(() => {
        if (!subjectId) return;

        setLoading(true);

        Promise.all([
            lmsApi.getSubjectTree(subjectId),
            lmsApi.getSubjectProgress(subjectId)
        ])
            .then(([treeData, progressData]) => {
                setTree(treeData);
                setProgress(progressData);
            })
            .catch(err => {
                console.error('Failed to load course data:', err);
                setError(err.message || 'Failed to load course content');
            });
    }, [subjectId, setTree, setProgress, setLoading, setError]);

    return (
        <AuthGuard>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <aside className="w-[300px] flex-shrink-0 border-r border-gray-200 bg-white h-full overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-500 underline"
                            >
                                Try Refreshing
                            </button>
                        </div>
                    ) : (
                        <SubjectSidebar tree={tree} />
                    )}
                </aside>
                <main className="flex-1 overflow-y-auto bg-white">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}

import { SubjectTree, SectionNode } from '@/lib/api';
import { useSidebarStore } from '@/store/sidebarStore';
import SectionItem from './SectionItem';
import SubjectProgressBar from './SubjectProgressBar';

interface SubjectSidebarProps {
    tree: SubjectTree | null;
}

export default function SubjectSidebar({ tree }: SubjectSidebarProps) {
    const { progress } = useSidebarStore();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {tree?.title || 'Loading Course...'}
                </h2>
            </div>

            {progress && (
                <SubjectProgressBar
                    percent={progress.percent_complete}
                    completed={progress.completed_videos}
                    total={progress.total_videos}
                />
            )}

            <nav className="flex-1 overflow-y-auto py-6">
                {tree ? (
                    tree.sections.map((section: SectionNode) => (
                        <SectionItem
                            key={section.id}
                            section={section}
                            subjectId={tree.id}
                        />
                    ))
                ) : (
                    <div className="px-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse flex flex-col gap-2">
                                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
                                <div className="h-10 bg-gray-50 rounded"></div>
                                <div className="h-10 bg-gray-50 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}
            </nav>
        </div>
    );
}

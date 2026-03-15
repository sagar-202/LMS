import { create } from 'zustand';
import { SubjectTree, SubjectProgress } from '@/lib/api';

interface SidebarState {
    tree: SubjectTree | null;
    progress: SubjectProgress | null;
    loading: boolean;
    error: string | null;

    setTree: (data: SubjectTree | null) => void;
    setProgress: (data: SubjectProgress | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    markVideoCompleted: (videoId: string | number) => void;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
    tree: null,
    progress: null,
    loading: false,
    error: null,

    setTree: (data) => set({ tree: data, loading: false }),
    setProgress: (data) => set({ progress: data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),

    markVideoCompleted: (videoId) => {
        const { tree, progress } = get();
        if (!tree) return;

        const idNum = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;

        let wasAlreadyCompleted = false;

        // Traverse tree and update the specific video
        const newSections = tree.sections.map(section => ({
            ...section,
            videos: section.videos.map(video => {
                if (video.id === idNum) {
                    if (video.is_completed) wasAlreadyCompleted = true;
                    return { ...video, is_completed: true };
                }
                return video;
            })
        }));

        // Update progress state if something changed
        if (!wasAlreadyCompleted && progress) {
            const newCompleted = progress.completed_videos + 1;
            const newPercent = Math.round((newCompleted / progress.total_videos) * 100);
            set({
                progress: {
                    ...progress,
                    completed_videos: newCompleted,
                    percent_complete: newPercent
                }
            });
        }

        // Compute unlock logic for the next video in sequence
        const allVideos = newSections.flatMap(s => s.videos);
        const currentIndex = allVideos.findIndex(v => v.id === idNum);

        if (currentIndex !== -1 && currentIndex < allVideos.length - 1) {
            const nextVideo = allVideos[currentIndex + 1];
            // Unlock next video if it was locked
            newSections.forEach(s => {
                s.videos = s.videos.map(v =>
                    v.id === nextVideo.id ? { ...v, locked: false } : v
                );
            });
        }

        set({ tree: { ...tree, sections: newSections } });
    }
}));

import { subjectsRepository, Subject } from './repository';
import { calculateVideoNavigation, OrderedVideo } from '../../utils/ordering';
import { progressService } from '../progress/service';

// DTO Interfaces for the Tree response
export interface VideoNode {
    id: number;
    title: string;
    order_index: number;
    duration_seconds: number;
    is_completed: boolean;
    locked: boolean;
}

export interface SectionNode {
    id: number;
    title: string;
    order_index: number;
    videos: VideoNode[];
}

export interface SubjectTree extends Omit<Subject, 'is_published' | 'created_at' | 'updated_at'> {
    sections: SectionNode[];
}

export class SubjectsService {
    async getAllPublishedSubjects() {
        const subjects = await subjectsRepository.getPublishedSubjects();
        return subjects;
    }

    async getSubjectById(subjectId: number) {
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }
        return subject;
    }

    async getSubjectTree(subjectId: number, userId: number): Promise<SubjectTree> {
        // 1. Validate subject exists and is published
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }

        // 2. Fetch all sections for the subject
        const sections = await subjectsRepository.getSectionsBySubjectId(subjectId);

        // 3. Fetch all videos for all these sections at once
        const sectionIds = sections.map(sec => sec.id);
        const videos = await subjectsRepository.getVideosBySectionIds(sectionIds);

        // Calculate global ordering flatmap once for previous-video dependency resolution
        const allOrderedVideos: OrderedVideo[] = [];
        sections.forEach(section => {
            const sectionVideos = videos.filter(v => v.section_id === section.id);
            sectionVideos.forEach(v => {
                allOrderedVideos.push({
                    id: v.id,
                    section_id: v.section_id,
                    section_order: section.order_index,
                    video_order: v.order_index
                });
            });
        });

        // Optional UX improvement: batch fetch progress instead of N+1 looping inside service
        // For basic functional compliance right now, we can await them sequentially or parallelly
        const allProgressMap = new Map<number, boolean>(); // videoId -> is_completed
        await Promise.all(videos.map(async (v) => {
            const progress = await progressService.getVideoProgress(userId, v.id);
            allProgressMap.set(v.id, progress.is_completed);
        }));

        // 4. Construct the tree structure and evaluate locks
        const sectionNodes: SectionNode[] = sections.map(section => {
            const sectionVideos = videos.filter(v => v.section_id === section.id);

            const videoNodes: VideoNode[] = sectionVideos.map(video => {
                const { previous_video_id } = calculateVideoNavigation(allOrderedVideos, video.id);

                let is_locked = false;
                if (previous_video_id !== null) {
                    const prevCompleted = allProgressMap.get(previous_video_id);
                    if (!prevCompleted) {
                        is_locked = true;
                    }
                }

                return {
                    id: video.id,
                    title: video.title,
                    order_index: video.order_index,
                    duration_seconds: video.duration_seconds,
                    is_completed: allProgressMap.get(video.id) || false,
                    locked: is_locked
                };
            });

            return {
                id: section.id,
                title: section.title,
                order_index: section.order_index,
                videos: videoNodes
            };
        });

        // 5. Build final tree
        const tree: SubjectTree = {
            id: subject.id,
            title: subject.title,
            slug: subject.slug,
            description: subject.description,
            sections: sectionNodes
        };

        return tree;
    }
}

export const subjectsService = new SubjectsService();

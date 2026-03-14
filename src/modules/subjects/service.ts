import { subjectsRepository, Subject } from './repository';

// DTO Interfaces for the Tree response
export interface VideoNode {
    id: number;
    title: string;
    order_index: number;
    duration_seconds: number;
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
        // omit sensitive/internal fields if necessary, or return as is
        return subjects;
    }

    async getSubjectById(subjectId: number) {
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }
        return subject;
    }

    async getSubjectTree(subjectId: number): Promise<SubjectTree> {
        // 1. Validate subject exists and is published
        const subject = await subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }

        // 2. Fetch all sections for the subject
        const sections = await subjectsRepository.getSectionsBySubjectId(subjectId);

        // 3. Fetch all videos for all these sections at once (to avoid N+1 query problem)
        const sectionIds = sections.map(sec => sec.id);
        const videos = await subjectsRepository.getVideosBySectionIds(sectionIds);

        // 4. Construct the tree structure
        const sectionNodes: SectionNode[] = sections.map(section => {
            // Filter videos for this specific section layer
            const sectionVideos = videos.filter(v => v.section_id === section.id);

            const videoNodes: VideoNode[] = sectionVideos.map(video => ({
                id: video.id,
                title: video.title,
                order_index: video.order_index,
                duration_seconds: video.duration_seconds
            }));

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

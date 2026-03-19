"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectsService = exports.SubjectsService = void 0;
const repository_1 = require("./repository");
const ordering_1 = require("../../utils/ordering");
const service_1 = require("../progress/service");
const repository_2 = require("../progress/repository");
class SubjectsService {
    async getAllPublishedSubjects() {
        const subjects = await repository_1.subjectsRepository.getPublishedSubjects();
        return subjects.map(s => ({
            ...s,
            youtube_url: s.first_video_id ? `https://www.youtube.com/watch?v=${s.first_video_id}` : null
        }));
    }
    async getSubjectById(subjectId) {
        const subject = await repository_1.subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }
        return subject;
    }
    async getSubjectTree(subjectId, userId) {
        // 1. Validate subject exists and is published
        const subject = await repository_1.subjectsRepository.getPublishedSubjectById(subjectId);
        if (!subject) {
            throw { statusCode: 404, message: 'Subject not found or not published' };
        }
        // 2. Fetch all sections for the subject
        const sections = await repository_1.subjectsRepository.getSectionsBySubjectId(subjectId);
        // 3. Fetch all videos for all these sections at once
        const sectionIds = sections.map(sec => sec.id);
        const videos = await repository_1.subjectsRepository.getVideosBySectionIds(sectionIds);
        // Calculate global ordering flatmap once for previous-video dependency resolution
        const allOrderedVideos = [];
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
        const allProgressMap = new Map(); // videoId -> is_completed
        await Promise.all(videos.map(async (v) => {
            const progress = await service_1.progressService.getVideoProgress(userId, v.id);
            allProgressMap.set(v.id, progress.is_completed);
        }));
        // 4. Construct the tree structure and evaluate locks
        const sectionNodes = sections.map(section => {
            const sectionVideos = videos.filter(v => v.section_id === section.id);
            const videoNodes = sectionVideos.map(video => {
                const { previous_video_id } = (0, ordering_1.calculateVideoNavigation)(allOrderedVideos, video.id);
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
        const tree = {
            id: subject.id,
            title: subject.title,
            slug: subject.slug,
            description: subject.description,
            category: subject.category,
            difficulty: subject.difficulty,
            total_duration: subject.total_duration,
            lessons_count: subject.lessons_count,
            sections: sectionNodes
        };
        return tree;
    }
    async getSmartResumeVideo(subjectId, userId) {
        // 1. Try to get the last watched video in this subject
        const lastWatchedId = await repository_2.progressRepository.getLastWatchedVideoInSubject(userId, subjectId);
        if (lastWatchedId) {
            return lastWatchedId;
        }
        // 2. If no progress, get the first video of the subject
        const firstVideo = await repository_1.subjectsRepository.getFirstVideoOfSubject(subjectId);
        return firstVideo ? firstVideo.id : null;
    }
}
exports.SubjectsService = SubjectsService;
exports.subjectsService = new SubjectsService();
//# sourceMappingURL=service.js.map
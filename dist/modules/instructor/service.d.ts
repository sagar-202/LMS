import { Subject, Video } from '../subjects/repository';
export declare class InstructorService {
    createCourse(userId: number, data: Partial<Subject>): Promise<{
        id: number;
        slug: string;
    }>;
    getInstructorDashboard(userId: number): Promise<Subject[]>;
    addLesson(userId: number, subjectId: number, sectionTitle: string, lessonData: Partial<Video>): Promise<{
        videoId: number;
        sectionId: number;
    }>;
}
export declare const instructorService: InstructorService;
//# sourceMappingURL=service.d.ts.map
import { Subject, Video } from '../subjects/repository';
export declare class InstructorRepository {
    createSubject(data: Partial<Subject>): Promise<number>;
    addInstructorToCourse(subjectId: number, userId: number): Promise<void>;
    getSubjectsByInstructor(userId: number): Promise<Subject[]>;
    createSection(subjectId: number, title: string, orderIndex: number): Promise<number>;
    createVideo(sectionId: number, data: Partial<Video>): Promise<number>;
    isInstructorOfCourse(userId: number, subjectId: number): Promise<boolean>;
}
export declare const instructorRepository: InstructorRepository;
//# sourceMappingURL=repository.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectsRepository = exports.SubjectsRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class SubjectsRepository {
    async getPublishedSubjects() {
        const query = `
            SELECT s.*, 
                (SELECT v.youtube_video_id 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id 
                 ORDER BY sec.order_index ASC, v.order_index ASC 
                 LIMIT 1) as first_video_id,
                (SELECT COUNT(*) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as lessons_count,
                (SELECT COALESCE(SUM(v.duration_seconds), 0) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as total_duration
            FROM subjects s 
            WHERE s.is_published = TRUE 
            ORDER BY s.created_at DESC
        `;
        const [rows] = await db_1.default.query(query);
        return rows;
    }
    async getPublishedSubjectById(subjectId) {
        const query = `
            SELECT s.*,
                (SELECT COUNT(*) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as lessons_count,
                (SELECT COALESCE(SUM(v.duration_seconds), 0) 
                 FROM videos v 
                 JOIN sections sec ON v.section_id = sec.id 
                 WHERE sec.subject_id = s.id) as total_duration
            FROM subjects s 
            WHERE s.id = ? AND s.is_published = TRUE 
            LIMIT 1
        `;
        const [rows] = await db_1.default.query(query, [subjectId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
    async getSectionsBySubjectId(subjectId) {
        const query = 'SELECT id, subject_id, title, order_index FROM sections WHERE subject_id = ? ORDER BY order_index ASC';
        const [rows] = await db_1.default.query(query, [subjectId]);
        return rows;
    }
    async getVideosBySectionIds(sectionIds) {
        if (sectionIds.length === 0)
            return [];
        // Create placeholders for the IN clause (?, ?, ?)
        const placeholders = sectionIds.map(() => '?').join(',');
        const query = `
      SELECT id, section_id, title, description, youtube_video_id, order_index, duration_seconds 
      FROM videos 
      WHERE section_id IN (${placeholders}) 
      ORDER BY section_id ASC, order_index ASC
    `;
        const [rows] = await db_1.default.query(query, sectionIds);
        return rows;
    }
    async getFirstVideoOfSubject(subjectId) {
        const query = `
      SELECT v.* 
      FROM videos v
      JOIN sections s ON v.section_id = s.id
      WHERE s.subject_id = ?
      ORDER BY s.order_index ASC, v.order_index ASC
      LIMIT 1
    `;
        const [rows] = await db_1.default.query(query, [subjectId]);
        if (rows.length === 0)
            return null;
        return rows[0];
    }
}
exports.SubjectsRepository = SubjectsRepository;
exports.subjectsRepository = new SubjectsRepository();
//# sourceMappingURL=repository.js.map
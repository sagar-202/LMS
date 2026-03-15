import pool from '../src/config/db';
import { ResultSetHeader } from 'mysql2';

async function seed() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        console.log('--- Database Seeding Started ---');

        // 1. Clean up existing data (Order matters for FK constraints)
        console.log('Seeding subjects, sections, and videos...');
        await connection.execute('DELETE FROM video_progress');
        await connection.execute('DELETE FROM enrollments');
        await connection.execute('DELETE FROM videos');
        await connection.execute('DELETE FROM sections');
        await connection.execute('DELETE FROM subjects');

        // COURSE 1: JavaScript Fundamentals
        console.log('Seeding Course 1: JavaScript Fundamentals...');
        const [subject1] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            [
                'JavaScript Fundamentals',
                'javascript-fundamentals',
                'Learn JavaScript from scratch including variables, functions and arrays.',
                'Frontend',
                true
            ]
        );
        const subject1Id = subject1.insertId;

        const [section1] = await connection.execute<ResultSetHeader>(
            'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
            [subject1Id, 'JavaScript Introduction', 1]
        );
        const section1Id = section1.insertId;

        const jsVideos = [
            { title: 'What is JavaScript', id: 'W6NZfCO5SIk', index: 1 },
            { title: 'JavaScript Variables', id: '9M4XKi25I2M', index: 2 },
            { title: 'JavaScript Functions', id: 'PkZNo7MFNFg', index: 3 }
        ];

        for (const video of jsVideos) {
            await connection.execute(
                'INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)',
                [section1Id, video.title, video.id, video.index, `Learn about ${video.title.toLowerCase()}.`]
            );
        }

        // COURSE 2: React Beginner Course
        console.log('Seeding Course 2: React Beginner Course...');
        const [subject2] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            [
                'React Beginner Course',
                'react-beginner-course',
                'Learn React fundamentals including JSX, components and props.',
                'Frontend',
                true
            ]
        );
        const subject2Id = subject2.insertId;

        const [section2] = await connection.execute<ResultSetHeader>(
            'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
            [subject2Id, 'React Basics', 1]
        );
        const section2Id = section2.insertId;

        const reactVideos = [
            { title: 'What is React', id: 'Tn6-PIqc4UM', index: 1 },
            { title: 'JSX Explained', id: 'hdI2bqOjy3c', index: 2 },
            { title: 'React Components', id: 'SqcY0GlETPk', index: 3 }
        ];

        for (const video of reactVideos) {
            await connection.execute(
                'INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)',
                [section2Id, video.title, video.id, video.index, `Learn about ${video.title.toLowerCase()}.`]
            );
        }

        // COURSE 3: Python for Beginners
        console.log('Seeding Course 3: Python for Beginners...');
        const [subject3] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['Python for Beginners', 'python-for-beginners', 'Master the basics of Python programming from variables to control flow.', 'Backend', true]
        );
        const subject3Id = subject3.insertId;

        const [sec3_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject3Id, 'Python Basics', 1]);
        const videos3_1 = [{ title: 'Python Introduction', id: '_uQrJ0TkZlc', index: 1 }, { title: 'Python Variables', id: 'rfscVS0vtbw', index: 2 }];
        for (const v of videos3_1) await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec3_1.insertId, v.title, v.id, v.index, `Learn about ${v.title.toLowerCase()}.`]);

        const [sec3_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject3Id, 'Control Flow', 2]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec3_2.insertId, 'Python If Statements', 'kqtD5dpn9C8', 1, 'Understanding control flow in Python.']);

        // COURSE 4: Node.js Backend Development
        console.log('Seeding Course 4: Node.js Backend Development...');
        const [subject4] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['Node.js Backend Development', 'node-js-backend', 'Build powerful server-side applications with Node.js and Express.', 'Backend', true]
        );
        const subject4Id = subject4.insertId;

        const [sec4_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject4Id, 'Node Fundamentals', 1]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec4_1.insertId, 'Node.js Crash Course', 'TlB_eWDSMt4', 1, 'Get started with Node.js basics.']);

        const [sec4_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject4Id, 'Express API', 2]);
        const videos4_2 = [{ title: 'REST API Explained', id: 'Oe421EPjeBE', index: 1 }, { title: 'Building with Express', id: 'L72fhGm1tfE', index: 2 }];
        for (const v of videos4_2) await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec4_2.insertId, v.title, v.id, v.index, `Learn about ${v.title.toLowerCase()}.`]);

        // COURSE 5: SQL & Databases
        console.log('Seeding Course 5: SQL & Databases...');
        const [subject5] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['SQL & Databases', 'sql-databases', 'Master relational databases and SQL query language.', 'Data', true]
        );
        const subject5Id = subject5.insertId;

        const [sec5_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject5Id, 'SQL Basics', 1]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec5_1.insertId, 'SQL for Beginners', 'HXV3zeQKqGY', 1, 'Learn SQL fundamentals.']);

        const [sec5_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject5Id, 'Advanced Queries', 2]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec5_2.insertId, 'Joins and Subqueries', '7S_tz1z_5bA', 1, 'Master complex database queries.']);

        // COURSE 6: System Design Fundamentals
        console.log('Seeding Course 6: System Design Fundamentals...');
        const [subject6] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['System Design Fundamentals', 'system-design', 'Learn how to design scalable and distributed systems.', 'Backend', true]
        );
        const subject6Id = subject6.insertId;

        const [sec6_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject6Id, 'Scalability', 1]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec6_1.insertId, 'Introduction to Scalability', 'bUHFg8CZFws', 1, 'Understanding scale in software.']);

        const [sec6_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject6Id, 'Load Balancing', 2]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec6_2.insertId, 'Load Balancers Explained', 'UzLMhqg3_Wc', 1, 'Learn about traffic distribution.']);

        // COURSE 7: Machine Learning Basics
        console.log('Seeding Course 7: Machine Learning Basics...');
        const [subject7] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['Machine Learning Basics', 'machine-learning', 'Introduction to ML concepts and regression models.', 'Data', true]
        );
        const subject7Id = subject7.insertId;

        const [sec7_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject7Id, 'Introduction', 1]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec7_1.insertId, 'What is ML', 'GwIo3gDZCVQ', 1, 'ML concept introduction.']);

        const [sec7_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject7Id, 'Regression', 2]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec7_2.insertId, 'Linear Regression', 'aircAruvnKk', 1, 'Understanding regression models.']);

        // COURSE 8: Docker & DevOps
        console.log('Seeding Course 8: Docker & DevOps...');
        const [subject8] = await connection.execute<ResultSetHeader>(
            'INSERT INTO subjects (title, slug, description, category, is_published) VALUES (?, ?, ?, ?, ?)',
            ['Docker & DevOps', 'docker-devops', 'Modern containerization and DevOps workflows.', 'DevOps', true]
        );
        const subject8Id = subject8.insertId;

        const [sec8_1] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject8Id, 'Docker Basics', 1]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec8_1.insertId, 'Docker Crash Course', 'fqMOX6JJhGo', 1, 'Get started with Docker containers.']);

        const [sec8_2] = await connection.execute<ResultSetHeader>('INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)', [subject8Id, 'Containers', 2]);
        await connection.execute('INSERT INTO videos (section_id, title, youtube_video_id, order_index, description) VALUES (?, ?, ?, ?, ?)', [sec8_2.insertId, 'Container Management', '3c-iBn73dDE', 1, 'Managing dockerized apps.']);

        await connection.commit();
        console.log('Seeding completed successfully.');
    } catch (error) {
        await connection.rollback();
        console.error('Seeding failed:', error);
    } finally {
        connection.release();
        await pool.end();
    }
}

seed();

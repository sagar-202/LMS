const https = require('https');
const HOST = 'lms-jd7r.onrender.com';

function apiCall(path, method, data, token = null) {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : '';
        const headers = { 'Content-Type': 'application/json', 'Content-Length': payload.length };
        if (token) { headers['Authorization'] = 'Bearer ' + token; }

        const req = https.request({ hostname: HOST, path: path, method: method, headers: headers }, (res) => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { resolve(d); } });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function run() {
    try {
        const email = 'speedrun_hero_' + Date.now() + '@example.com';
        console.log('Registering test user...');
        const reg = await apiCall('/api/auth/register', 'POST', { name: 'Hero', email, password: 'password123', role: 'student' });
        const token = reg.data && reg.data.accessToken;
        
        console.log('Enrolling in course 27...');
        await apiCall('/api/enrollments', 'POST', { subjectId: 27 }, token);

        console.log('Fetching course videos...');
        const course = await apiCall('/api/subjects/27/tree', 'GET', null, token);
        let completed = 0;
        
        if (!course || !course.data || !course.data.sections) {
            console.log('NO SECTIONS FOUND FOR 27! Response:', JSON.stringify(course));
            return;
        }

        for (const section of course.data.sections) {
            for (const video of section.videos) {
                console.log('Completing video:', video.title);
                await apiCall('/api/progress/video', 'POST', { videoId: video.id, isCompleted: true }, token);
                completed++;
            }
        }
        console.log('Successfully completed', completed, 'videos!');
        console.log('\n--- BROWSER SUBAGENT TEST ACCOUNT ---');
        console.log('Email:', email);
        console.log('Password: password123');
        console.log('-----------------------------------');
    } catch (e) { console.error('Error:', e); }
}
run();

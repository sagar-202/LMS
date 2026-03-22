const https = require('https');
const HOST = 'lms-jd7r.onrender.com';

function apiCall(path, method, data, token = null) {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : '';
        const headers = { 'Content-Type': 'application/json', 'Content-Length': payload.length };
        if (token) headers['Authorization'] = 'Bearer ' + token;

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
        const email = 'speedrunner_v' + Date.now() + '@example.com';
        console.log('Registering test user...');
        const reg = await apiCall('/api/auth/register', 'POST', { name: 'Speedrunner', email, password: 'password123', role: 'student' });
        const token = reg.data && reg.data.accessToken;
        
        console.log('Fetching all courses...');
        const all = await apiCall('/api/subjects', 'GET');
        const courseId = all.data[0].id;
        console.log('Targeting Course ID:', courseId, all.data[0].title);

        console.log('Enrolling in course...');
        await apiCall('/api/enrollments', 'POST', { subjectId: courseId }, token);

        console.log('Fetching course videos...');
        const course = await apiCall('/api/subjects/' + courseId, 'GET', null, token);
        let completed = 0;
        for (const section of course.data.sections) {
            for (const video of section.videos) {
                console.log('Completing video:', video.title);
                await apiCall('/api/progress/video', 'POST', { videoId: video.id }, token);
                completed++;
            }
        }
        console.log('Successfully completed', completed, 'videos!');
        console.log('\n--- BROWSER SUBAGENT READY ---');
        console.log('Email:', email);
        console.log('Password: password123');
    } catch (e) { console.error('Error:', e); }
}
run();

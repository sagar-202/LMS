const https = require('https');
const HOST = 'lms-jd7r.onrender.com';

function apiCall(path, method, data, token = null, getAuthCookie = false) {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : '';
        const headers = { 'Content-Type': 'application/json', 'Content-Length': payload.length };
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
            headers['Cookie'] = 'token=' + token;
        }

        const req = https.request({ hostname: HOST, path: path, method: method, headers: headers }, (res) => {
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => { 
                try { 
                    const j = JSON.parse(d); 
                    if(getAuthCookie) {
                        const setCookie = res.headers['set-cookie'];
                        j._cookies = setCookie;
                    }
                    resolve(j); 
                } catch (e) { resolve(d); } 
            });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function run() {
    try {
        const email = 'speedrun' + Date.now() + '@example.com';
        console.log('Registering test user...');
        const reg = await apiCall('/api/auth/register', 'POST', { name: 'Speedrunner', email, password: 'password123', role: 'student' });
        const token = reg.data && reg.data.accessToken;
        if (!token) { console.log('Registration failed:', reg); return; }
        
        console.log('Enrolling in course 27...');
        await apiCall('/api/enrollments', 'POST', { subjectId: 27 }, token);

        console.log('Fetching course videos...');
        const course = await apiCall('/api/subjects/27', 'GET', null, token);
        let completed = 0;
        for (const section of course.data.sections) {
            for (const video of section.videos) {
                console.log('Completing video:', video.title);
                await apiCall('/api/progress/video', 'POST', { videoId: video.id }, token);
                completed++;
            }
        }
        console.log('Successfully completed', completed, 'videos!');
        console.log('Login credentials for browser agent -> Email:', email, 'Password: password123');
    } catch (e) { console.error('Error:', e); }
}
run();

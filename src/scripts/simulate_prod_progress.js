const https = require('https');

const HOST = 'lms-jd7r.onrender.com';

function apiCall(path, method, data, token = null) {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : '';
        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const req = https.request({
            hostname: HOST,
            path: path,
            method: method,
            headers: headers
        }, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(d));
                } catch (e) {
                    resolve(d);
                }
            });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function run() {
    try {
        console.log('Logging in...');
        const login = await apiCall('/api/auth/login', 'POST', { email: 'v_prod_eagle2@example.com', password: 'password123' });
        const token = login.data && login.data.accessToken;
        
        if (!token) {
            console.log('Login failed:', login);
            return;
        }
        console.log('Logged in successfully! Token:', token.substring(0, 10) + '...');

        console.log('Fetching enrolled courses...');
        const enrollments = await apiCall('/api/enrollments/my', 'GET', null, token);
        
        if (!enrollments.data || enrollments.data.length === 0) {
            console.log('No courses enrolled! Exiting.');
            return;
        }

        const courseId = enrollments.data[0].subject_id;
        console.log('Targeting Course ID:', courseId);

        console.log('Fetching course videos...');
        const course = await apiCall(`/api/subjects/${courseId}`, 'GET', null, token);
        
        if (!course.data || !course.data.sections) {
            console.log('No sections found for course:', course);
            return;
        }

        let totalVideos = 0;
        for (const section of course.data.sections) {
            for (const video of section.videos) {
                console.log(`Marking video [${video.id}] ${video.title} as completed...`);
                await apiCall('/api/progress/video', 'POST', { videoId: video.id }, token);
                totalVideos++;
                await new Promise(r => setTimeout(r, 500)); // Sleep just in case
            }
        }

        console.log(`\n🎉 Successfully marked ${totalVideos} videos 100% completed on Production for Course ${courseId}!`);
        
        console.log('Validating final progress heartbeat...');
        const stats = await apiCall('/api/progress/my-stats', 'GET', null, token);
        console.dir(stats.data, { depth: null });
        
    } catch (e) {
        console.error('Error:', e);
    }
}

run();

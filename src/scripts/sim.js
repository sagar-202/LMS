async function run() {
    try {
        const email = 'runner' + Date.now() + '@example.com';
        console.log('Registering:', email);
        const r = await fetch('https://lms-jd7r.onrender.com/api/auth/register', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: 'Runner', email, password: 'password123', role: 'student'})
        });
        const data = await r.json();
        const token = data.data.accessToken;
        console.log('Token generated successfully.');

        console.log('Enrolling in Subject 27...');
        await fetch('https://lms-jd7r.onrender.com/api/enrollments', {
            method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            body: JSON.stringify({subjectId: 27})
        });

        console.log('Fetching course 27 logic...');
        const cRes = await fetch('https://lms-jd7r.onrender.com/api/subjects/27', {
            headers: {'Authorization': 'Bearer ' + token}
        });
        const cData = await cRes.json();
        
        let count = 0;
        for (const sec of cData.data.sections) {
            for (const vid of sec.videos) {
                console.log('Marking completed:', vid.title);
                await fetch('https://lms-jd7r.onrender.com/api/progress/video', {
                    method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
                    body: JSON.stringify({videoId: vid.id})
                });
                count++;
            }
        }
        console.log('Done! Marked ' + count + ' videos! Use this email to login:', email);
    } catch(e) { console.error('Error:', e); }
}
run();

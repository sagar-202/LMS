// Native fetch is available in Node.js 18+
async function run() {
    console.log("1. Logging in...");
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testerfinal@example.com', password: 'password123' })
    });
    
    if(!loginRes.ok) {
        console.error("Login failed:", await loginRes.text());
        return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.accessToken ?? loginData.data?.accessToken;
    console.log("Token obtained:", !!token);

    console.log("2. Fetching certificates...");
    const certRes = await fetch('http://localhost:3000/api/certificates/my', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    console.log("Cert Status:", certRes.status);
    const certText = await certRes.text();
    console.log("Cert Body:", certText);
}
run();

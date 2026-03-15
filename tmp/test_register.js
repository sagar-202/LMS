const fetch = require('node-fetch');

async function testRegister() {
    console.log('Testing registration...');
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: `test_${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response body:', data);
    } catch (error) {
        console.error('Error during test registration:', error);
    }
}

testRegister();

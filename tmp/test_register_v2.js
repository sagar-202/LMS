const http = require('http');

const data = JSON.stringify({
    name: 'Tester',
    email: 'tester' + Date.now() + '@example.com',
    password: 'password123'
});

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending registration request to ' + options.hostname + ':' + options.port + options.path);

const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);

    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();

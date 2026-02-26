const http = require('http');

async function request(path, method = 'GET', body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 8001,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data || '{}') });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Deep E2E Tests...');
    let token = null;

    try {
        // 1. Check Health
        console.log('\n[1] Checking Health...');
        const health = await request('/health');
        console.log('Health Status:', health.status);

        // 2. Register a new user
        console.log('\n[2] Registering Test User...');
        const email = `test.e2e.${Date.now()}@gigligo.com`;
        const regRes = await request('/auth/register', 'POST', {
            email,
            password: 'Password123!',
            fullName: 'E2E Test User',
            role: 'SELLER',
            termsAccepted: true
        });
        console.log('Register Status:', regRes.status);
        console.log('Register Response:', regRes.data);

        // 3. Get OTP from DB
        console.log('\n[3] Fetching OTP from Database...');
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const otpRecord = await prisma.otpCode.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });
        console.log('OTP Found:', otpRecord ? otpRecord.code : 'None');

        // 4. Verify OTP
        console.log('\n[4] Verifying OTP...');
        if (otpRecord) {
            const verifyRes = await request('/auth/verify-otp', 'POST', {
                email,
                code: otpRecord.code
            });
            console.log('Verify Status:', verifyRes.status);
            if (verifyRes.data && verifyRes.data.access_token) {
                token = verifyRes.data.access_token;
                console.log('✅ Successfully obtained JWT token!');
            } else {
                console.log('Verify Response:', verifyRes.data);
            }
        }

        // 5. Fetch Public Gigs
        console.log('\n[5] Fetching Public Gigs...');
        const gigsRes = await request('/gigs');
        console.log('Gigs Status:', gigsRes.status);
        if (gigsRes.data && Array.isArray(gigsRes.data)) {
            console.log(`Found ${gigsRes.data.length} gigs.`);
        }

        console.log('\n✅ Basic programmatic testing complete.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

runTests();

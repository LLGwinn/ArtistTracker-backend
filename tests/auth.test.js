process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');

let testDate;

/** ADD TEST USER TO DB */

beforeEach(async function() {
    testDate = new Date().toLocaleDateString();

    // insert a test user
    const hashedPassword = await bcrypt.hash('testpw', BCRYPT_WORK_FACTOR);
    await db.query(`
        INSERT INTO users (id, username, password, fname, email, base_city, radius)
        VALUES (1, 'testuser', '${hashedPassword}', 'Test', 'test@test.com', 113217, 75)`
        );
});

/** REMOVE RECORDS FROM TABLE, DISCONNECT DB */

afterEach(async function() {
    await db.query('DELETE FROM users');
});

afterAll(async function() {
    await db.end();
});

/** BEGIN TESTS */

describe('POST /auth/token', () => {
    test ('gets token if username/password authenticates', async() => {      
        const res = await request(app).post('/auth/token').
                    send ({username: 'testuser', password: 'testpw'});

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
    });

    test ('throws error if authentication fails', async() => {      
        const res = await request(app).post('/auth/token').
                    send ({username: 'testuser', password: 'badpw'});

        expect(res.statusCode).toBe(401);
    });
})

describe('POST /auth/register', () => {
    const newUser = {username: 'newuser', password: 'newpw', firstName: 'New', 
                        email: 'newemail@test.com', city: 12345, radius: 100};
    test ('adds user to db and returns token', async() => {      
        const res = await request(app).post('/auth/register').
                    send (newUser);

        const checkForUserInDb = await db.query(
            `SELECT id 
            FROM users 
            WHERE username = '${newUser.username}'`
        )
        
        expect(res.statusCode).toBe(201);
        expect(checkForUserInDb.rows.length).toBe(1);
        expect(res.body.token).toEqual(expect.any(String));
    });

    test ('throws error if duplicate username', async() => {  
        newUser.username = 'testuser';    
        const res = await request(app).post('/auth/register').
                    send (newUser);

        expect(res.statusCode).toBe(400);
    });
})
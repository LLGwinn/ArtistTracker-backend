process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');

let testArtist;
let testUser;

/** ADD TEST ARTIST, TEST USER TO DB */

beforeEach(async function() {
    // insert a test artist
    let result = await db.query(`
        INSERT INTO artists (id, artist_name)
        VALUES ('1000ABC', 'Test Artist')
        RETURNING id, artist_name`);
    testArtist = result.rows[0];

    // insert a test user
    const hashedPassword = await bcrypt.hash('testpw', BCRYPT_WORK_FACTOR);
    result = await db.query(`
        INSERT INTO users (id, username, password, fname, email, base_city, radius)
        VALUES (1, 'testuser', '${hashedPassword}', 'Test', 'test@test.com', 113217, 75)
        RETURNING id, username`);
    testUser = result.rows[0];
});

/** REMOVE RECORDS FROM TABLE, DISCONNECT DB */

afterEach(async function() {
    await db.query('DELETE FROM artists');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM users_artists');
});

afterAll(async function() {
    await db.end();
});

/** BEGIN TESTS */

describe('POST /artists/add', () => {
    test ('throws error if duplicate user/artist record in users_artist table', async() => {
        // add record to users_artists that we can duplicate
        await db.query(`
            INSERT INTO users_artists (user_id, artist_id)
            VALUES (1, '1000ABC')`);
        // try to add duplicate user/artist
        const res = await request(app).post('/artists/add').
                        send ({artistId: '1000ABC', artistName: 'Duplicate Artist', userId: 1});
        
        expect(res.statusCode).toBe(400);
    });

    test('adds new records to artists table if not duplicate', async() => {
        const res = await request(app).post('/artists/add').
                        send ({artistId: '1000ABC', artistName: 'Duplicate Artist', userId: 1});

        const artistsInTable = await db.query('SELECT * FROM artists');

        expect(res.statusCode).toBe(201);
        expect(artistsInTable.rows.length).toEqual(1);
    })

    test('adds new record to users_artists table if not duplicate', async() => {
        await request(app).post('/artists/add').
                        send ({artistId: '1000ABC', artistName: 'Duplicate Artist', userId: 1});

        const users_artistsInTable = await db.query('SELECT * FROM users_artists');

        expect(users_artistsInTable.rows.length).toEqual(1);
    })

    test('returns an user/artist object', async() => {
        const res = await request(app).post('/artists/add').
                        send ({artistId: '1000ABC', artistName: 'Duplicate Artist', userId: 1});
        
        expect(res.body.artist).toEqual({user_id: 1, artist_id: '1000ABC'});
    })

    test('throws error if artist cannot be added to db', async () => {
        const res = await request(app).post('/artists/add').send ({artistId: '1000ABC'});

        expect(res.statusCode).toBe(500);      
    })
})

describe('GET /artists/:id', () => {
    test('gets an artist by id', async() => {
        const res = await request(app).get('/artists/1000ABC');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({artist: {id:'1000ABC', artist_name: 'Test Artist'}});
    })

    test('throws error if artist not found', async() => {
        const res = await request(app).get('/artists/2000ABC');

        expect(res.statusCode).toBe(404);

    })
})
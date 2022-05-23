process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');

let testEvent;
let testUser;
let testDate;

/** ADD TEST EVENT, TEST USER TO DB */

beforeEach(async function() {
    testDate = new Date().toLocaleDateString();
    // insert a test event
    let result = await db.query(`
        INSERT INTO events (id, event_name, event_date, artist, event_url,
                                venue, venue_city, venue_state)
        VALUES ('9000ABC', 'Test Event Name', '${testDate}', 'Test Artist', 'https://testevent.com',
                                'Test Venue', 'Test City', 'Test State')
        RETURNING id, event_name`);
    testEvent = result.rows[0];

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
    await db.query('DELETE FROM events');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM users_events');
});

afterAll(async function() {
    await db.end();
});

/** BEGIN TESTS */

describe('POST /events/add', () => {
    test ('throws error if duplicate user/event record in users_events table', async() => {
        // add record to users_events that we can duplicate
        await db.query(`
            INSERT INTO users_events (user_id, event_id)
            VALUES (1, '9000ABC')`);
        
        // try to add duplicate user/event
        const event = {id: '9000ABC', name: 'Test Event', datetime: testDate, artist: 'Test Artist',
                            url: 'https://testevent.com', venue: 'Test Venue', venueCity: 'Test City',
                                        venueState: 'Test State'}
        const res = await request(app).post('/events/add').send ({event, userId:1});
        
        expect(res.statusCode).toBe(400);
    });

    test('adds new record to events table if not duplicate', async() => {
        const event = {id: '9000ABC', name: 'Test Event', datetime: testDate, artist: 'Test Artist',
                            url: 'https://testevent.com', venue: 'Test Venue', venueCity: 'Test City',
                                venueState: 'Test State'}
        const res = await request(app).post('/events/add').send ({event, userId: 1});

        const eventsInTable = await db.query('SELECT * FROM events');

        expect(res.statusCode).toBe(201);
        expect(eventsInTable.rows.length).toEqual(1);
    })

    test('adds new record to users_events table if not duplicate', async() => {
        const event = {id: '9000ABC', name: 'Test Event', datetime: testDate, artist: 'Test Artist',
                            url: 'https://testevent.com', venue: 'Test Venue', venueCity: 'Test City',
                                venueState: 'Test State'}
        await request(app).post('/events/add').send ({event, userId: 1});

        const users_eventsInTable = await db.query('SELECT * FROM users_events');

        expect(users_eventsInTable.rows.length).toEqual(1);
    })

    test('returns an user/event object', async() => {
        const event = {id: '9000ABC', name: 'Test Event', datetime: testDate, artist: 'Test Artist',
                            url: 'https://testevent.com', venue: 'Test Venue', venueCity: 'Test City',
                                venueState: 'Test State'}
        const res = await request(app).post('/events/add').send ({event, userId: 1});
        
        expect(res.body).toEqual({user_id: 1, event_id: '9000ABC'});
    })

    test('throws error if event cannot be added to db', async () => {
        const res = await request(app).post('/events/add').send ({userId: 1});

        expect(res.statusCode).toBe(500);      
    })
})

describe('GET /events/:id', () => {
    test('gets an event by id', async() => {
        const res = await request(app).get('/events/9000ABC');

        expect(res.statusCode).toBe(200);
        expect(res.body.event.id).toEqual('9000ABC');

    })

    test('throws error if event not found', async() => {
        const res = await request(app).get('/events/2000ABC');

        expect(res.statusCode).toBe(404);

    })
})
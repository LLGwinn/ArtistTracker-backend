process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY1MzA3ODE2Mn0.fFALYeE4PBT3siReIbxZVqFN4Tct-dTXzN9ELTsxy-8';

/** ADD TEST EVENT, TEST USER TO DB */

beforeEach(async function() {
    testDate = new Date().toLocaleDateString();
    headers = { Authorization: `Bearer ${token}` }; 

    // insert a test user
    const hashedPassword = await bcrypt.hash('testpw', BCRYPT_WORK_FACTOR);
    await db.query(`
        INSERT INTO users (id, username, password, fname, email, base_city, radius)
        VALUES (1, 'testuser', '${hashedPassword}', 'Test', 'test@test.com', 113217, 75)`
        );

    // insert a test artist
    await db.query(`
        INSERT INTO artists (id, artist_name)
        VALUES ('1000ABC', 'Test Artist')`
        );

    // add record to users_artists
    await db.query(`
        INSERT INTO users_artists (user_id, artist_id)
        VALUES (1, '1000ABC')`
        );

    // insert a test event
    await db.query(`
        INSERT INTO events (id, event_name, event_date, artist, event_url, venue, venue_city, venue_state)
        VALUES ('9000ABC', 'Test Event Name', '${testDate}', 'Test Artist', 'https://testevent.com',
                'Test Venue', 'Test City', 'Test State')`
        );

    // add record to users_events
    await db.query(`
        INSERT INTO users_events (user_id, event_id)
        VALUES (1, '9000ABC')`
        );
});

/** REMOVE RECORDS FROM TABLE, DISCONNECT DB */

afterEach(async function() {
    await db.query('DELETE FROM events');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM artists');
    await db.query('DELETE FROM users_events');
    await db.query('DELETE FROM users_artists');
});

afterAll(async function() {
    await db.end();
});

/** BEGIN TESTS */

describe('PATCH /users/:id', () => {
    test ('throws error if data validation fails', async() => {    
        const res = await request(app).patch('/users/1').
            set(headers).
            send ({favColor: 'blue'});
        
        expect(res.statusCode).toBe(400);
    });

    test ('updates data correctly', async() => {    
        const res = await request(app).patch('/users/1').
            set(headers).
            send ({firstName: 'Other'});

        const updatedData = await db.query(`
            SELECT fname FROM users WHERE fname='Other'`
            );
        
        expect(res.statusCode).toBe(200);
        expect(updatedData.rows.length).toEqual(1);
    });

    test('throws Unauthorized error if no verified token sent', async() => {
        const res = await request(app).patch('/users/1').
            send({fname: 'Tom'});

        expect(res.statusCode).toEqual(401);
    })
})

describe('GET /users/:id/artists', () => {
    test('gets artists with user_id=[id] in users_artists', async() => {
        const res = await request(app).get('/users/1/artists');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({artists: [{id: '1000ABC', artist_name: 'Test Artist'}]});
    });

    test('returns empty array if no user/artist records', async() => {
        await db.query('DELETE FROM users_artists');
        const res = await request(app).get('/users/1/artists');

        expect(res.body).toEqual({artists: []});
    });

    test('throws error if user not found', async() => {
        const res = await request(app).get('/users/500/artists');
        expect(res.statusCode).toBe(400);
    });
})

describe('DELETE /users/:id/artists', () => {
    test('deletes user/artist record from users_artists', async() => {
        const res = await request(app).delete('/users/1/artists').
            set(headers).
            send({artistId: '1000ABC'});
        
        const userArtistsRes = await db.query('SELECT * FROM users_artists');

        expect(res.statusCode).toBe(200);
        expect(userArtistsRes.rows).toBeUndefined;
    })

    test('throws Unauthorized error if no verified token sent', async() => {
        const res = await request(app).delete('/users/1/artists').
            send({artistId: '9999'});

        expect(res.statusCode).toEqual(401);
    })
})

describe('GET /users/:id/events', () => {
    test('gets events with user_id=[id] in users_events', async() => {
        const res = await request(app).get('/users/1/events');

        expect(res.statusCode).toBe(200);
        expect(res.body.events[0].id).toEqual('9000ABC');
    });

    test('returns empty array if no user/events records', async() => {
        await db.query('DELETE FROM users_events');
        const res = await request(app).get('/users/1/events');

        expect(res.body).toEqual({events: []});
    });

    test('throws error if user not found', async() => {
        const res = await request(app).get('/users/500/events');
        expect(res.statusCode).toBe(400);
    });
})

describe('DELETE /users/:id/events', () => {
    test('deletes user/event record from users_events', async() => {
        const res = await request(app).delete('/users/1/events').
            set(headers).
            send({eventId: '9000ABC'});
        
        const userEventsRes = await db.query('SELECT * FROM users_events');

        expect(res.statusCode).toBe(200);
        expect(userEventsRes.rows).toBeUndefined;
    });

    test('throws Unauthorized error if no verified token sent', async() => {
        const res = await request(app).delete('/users/1/events').
            send({eventId: '9999'});

        expect(res.statusCode).toEqual(401);
    });
})

describe('DELETE /users/:id', () => {
    test('removes user from db', async() => {
        const res = await request(app).delete('/users/1').
            set(headers);

        const usersRes = ('SELECT * FROM users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({deleted: '1'});
        expect(usersRes.rows).toBeUndefined();
    });

    test('throws Unauthorized error if no verified token sent', async() => {
        const res = await request(app).delete('/users/1')
        expect(res.statusCode).toEqual(401);
    });
})
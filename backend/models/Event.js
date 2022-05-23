"use strict"

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
  } = require("../errors");

  class Event {

    /** Adds a new event:
     *  If already in users_events for this user, throw error.
     * 
     *  If not:
     *      - add event to events table if not already there. 
     *      - add to users_events table
     *      - return {user_id, event_id} or Error
     *  
    */

    static async addEvent( event, userId ) {
        // check users_events for duplicate
        const duplicateUsersEventsCheck = await db.query(
            `SELECT *
            FROM users_events
            WHERE user_id = $1 AND event_id = $2`,
            [userId, event.id]
        )
        if (duplicateUsersEventsCheck.rows[0]) {
            throw new BadRequestError (`Event has already been saved!`);
        }

        // look for duplicate event id in events table
        const duplicateEventCheck = await db.query(
            `SELECT id
             FROM events
             WHERE id = $1`,
             [event.id]
        );

        // if event is not already in events table, add it
        if (!duplicateEventCheck.rows[0]) {
            const newEventRes = await db.query(
                `INSERT INTO events (
                    id,
                    event_name,
                    event_date,
                    artist,
                    event_url,
                    venue,
                    venue_city,
                    venue_state
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING (id, event_name)`,
                [event.id, event.name, event.datetime, event.artist, event.url, 
                    event.venue, event.venueCity, event.venueState]   
            )
        }

        // add item to users_events table
        const userEventsRes = await db.query(
            `INSERT INTO users_events (user_id, event_id)
                VALUES ($1, $2)
                RETURNING user_id, event_id`,
                [userId, event.id]
        );
        const newEvent = userEventsRes.rows[0];
        if (!newEvent) throw new Error (`Could not add to users_events.`)

        return newEvent;
    }

    /** Given an event id, return event details.
    *
    *   Throws NotFoundError if event not found.
    **/

    static async getEvent(id) {
        const eventRes = await db.query(
            `SELECT *
            FROM events
            WHERE id = '${id}'`
        );
        const event = eventRes.rows[0];
        if (!event) throw new NotFoundError(`No event with id ${id}`);

        return event;
    }

    /** Remove event with given id from db.
     * 
     *  Returns alert message.
     */

    static async removeEvent(id) {
        const res = await db.query(
            `DELETE FROM events
             WHERE id=$1
             RETURNING id`,
             [id]
        )
        const event = res.rows[0];
        if (!event) throw new NotFoundError(`No record for event ${id}.`);

        return event;
    }
  }

  module.exports = Event;
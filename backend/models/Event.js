"use strict"

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
  } = require("../errors");

  class Event {

    /** Adds a new event:
     *  If already in users_events for this user, show alert and return.
     *  If not, add event to events table if not already there, 
     *  then add to users_events table.
     *  
    */

    static async addEvent( event, userId ) {
        // check users_events for duplicate
        const duplicateUsersEventsCheck = await db.query(
            `SELECT *
            FROM users_events
            WHERE user_id = $1 AND event_id = $2`,
            [event.userId, event.event.id]
        )
        if (duplicateUsersEventsCheck.rows[0]) {
            alert(`Event is already saved for this user.`);
            return;
            // or an error
        }

        // look for duplicate event id in events table
        const duplicateEventCheck = await db.query(
            `SELECT id
             FROM events
             WHERE id = $1`,
             [event.event.id]
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
                [event.event.id, event.event.name, event.event.datetime, event.event.artist,
                    event.event.url, event.event.venue, event.event.venueCity, event.event.venueState]   
            )
        }

        // add item to users_events table
        const userEventsRes = await db.query(
            `INSERT INTO users_events (user_id, event_id)
                VALUES ($1, $2)
                RETURNING user_id, event_id`,
                [event.userId, event.event.id]
        );

        return userEventsRes.rows[0];
    }

    /** Given an event id, return event name.
    *
    *    Throws NotFoundError if event not found.
    **/

    static async getEvent(id) {
        const eventRes = await db.query(
            `SELECT id,
                    event_name
            FROM events
            WHERE id = $1`,
            [id],
        );

        const event = eventRes.rows[0];

        if (!event) throw new NotFoundError(`No event with id ${id}`);

        return event;
    }

    /** Remove event with given id from db.
     * 
     *  Returns undefined
     */

    static async removeEvent(id) {
        const res = await db.query(
            `DELETE FROM events
             WHERE id=$1
             RETURNING id`,
             [id]
        )
        const event = result.rows[0];

        if (!event) throw new NotFoundError(`Cannot remove. No event with id ${id}`);

        return event;
    }
  }

  module.exports = Event;
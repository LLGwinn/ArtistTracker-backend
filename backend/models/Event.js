"use strict"

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
  } = require("../errors");

  class Event {

    /** Adds a new event to db 
     *  
     *  Returns { id: id, event_name: name }
    */

    static async addEvent(id, name) {
        const newEventRes = await db.query(
            `INSERT INTO events (
                id,
                event_name
             )
             VALUES ($1, $2)
             RETURNING (id, event_name)`,
             [id, name]    
        )

        return newEventRes.rows;
    }

    /** Given an event id, return event name.
    *
    *    Throws NotFoundError if event not found.
    **/

    static async getEvent(id) {
        const artistRes = await db.query(
            `SELECT id,
                    event_name
            FROM artists
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
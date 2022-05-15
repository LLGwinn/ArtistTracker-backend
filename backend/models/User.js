"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForUpdate } = require("../helpers/sqlUpdate")
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../errors");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** Related functions for users. */

class User {

  /** Authenticate user with username, password.
   *  Returns { id, username, firstName, email, city, radius, isAdmin }
   *
   *  Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // look for user in database
    const result = await db.query(
          `SELECT id, 
                  username,
                  password,
                  fname AS "firstName",
                  email,
                  base_city AS "city",
                  radius,
                  is_admin
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register new user with given data.
   *  Returns { id, username, firstName, email, city, radius, isAdmin }
   *
   *  Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, email, city, radius, isAdmin }) {
    // look for duplicate username in database
    const duplicateCheck = await db.query(
          `SELECT username
           FROM users
           WHERE username = $1`,
        [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            fname,
            email,
            base_city,
            radius,
            is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, username, fname AS "firstName", email, base_city AS "city", 
                     radius, is_admin AS "isAdmin"`,
        [
          username,
          hashedPassword,
          firstName,
          email,
          +city,
          radius,
          isAdmin
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, firstName, email, city, radius, isAdmin }, ...]
   **/

  static async findAllUsers() {
    const result = await db.query(
          `SELECT id,
                  username,
                  fname AS "firstName",
                  email,
                  base_city AS "city",
                  radius,
                  is_admin
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a user id, return data about user.
   *
   * Returns { username, firstName, artists, events }
   *   where artists is { id, artist_name }
   *   and events is {id, event_name}
   *  TODO: need to fix the artists/events return
   *
   * Throws NotFoundError if user not found.
   **/

  static async getUser(id) {
    const userRes = await db.query(
          `SELECT username,
                  fname AS "firstName",
                  email,
                  base_city AS "city",
                  radius
           FROM users
           WHERE id = $1`,
        [id],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user with id ${id}`);

    const userArtistsRes = await db.query(
          `SELECT ua.artist_id
           FROM users_artists ua
           WHERE ua.user_id = $1`, [id]);

    user.artists = userArtistsRes.rows.map(a => a.artist_id);
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { username, firstName, password, email, city, distancePref }
   *
   * Returns { username, firstName, email, city, distancePref }
   *
   * Throws NotFoundError if not found.
   *
   */

  static async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForUpdate(
        data,
        {
          firstName: "fname",
          city: "base_city",
        });
    const userIdVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${userIdVarIdx} 
                      RETURNING id,
                                username,
                                fname AS "firstName",
                                email,
                                base_city AS "city",
                                radius,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id ${id}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async removeUser(id) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE id = $1
           RETURNING username`,
        [id],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id ${id}`);
  }

  /** Return a list of artists for given user. */

   static async findUserArtists(userId) {
    const result = await db.query(
        `SELECT a.* FROM users_artists ua
         JOIN artists a
         ON ua.artist_id = a.id
         WHERE ua.user_id=${userId}`
    );

    const artists = result.rows;

    if (!artists) throw new NotFoundError(`No artists saved for User ${userId}`);

    return result.rows;
  }

  /** Return a list of saved events for given user. */

  static async findUserEvents(userId) {
    const result = await db.query(
        `SELECT e.*, a.artist_name
          FROM users_events ue
          JOIN events e
          ON ue.event_id = e.id
          JOIN artists a
          ON e.artist = a.id
          WHERE ue.user_id=${userId}`
    );

    const events = result.rows;
    console.log('rows========', result.rows)

    if (!events) throw new NotFoundError(`No events saved for User ${userId}`);

    return result.rows;
  }

  /** Remove user/artist record from users_artists */

  static async deleteUserArtist(id, artistId) {
    const result = await db.query(
      `DELETE FROM users_artists
       WHERE user_id=$1 AND artist_id=$2
       RETURNING user_id, artist_id`,
       [id, artistId]
    )

    if (!result.rows[0]) return ('No matching record. No deletion performed.')
    else return ('Deleted artist from user favorites.')
  }

  /** Remove user/event record from users_events */

  static async deleteUserEvent(id, eventId) {
    const result = await db.query(
      `DELETE FROM users_events
        WHERE user_id=$1 AND event_id=$2
        RETURNING user_id, event_id`,
        [id, eventId]
    )

    if (!result.rows[0]) return ('No matching record. No deletion performed.')
    else return ("Deleted event from your saved events.")
  }

}

module.exports = User;

"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../errors");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, firstName, email, city, distancePref }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
          `SELECT username,
                  password,
                  fname AS "firstName",
                  email,
                  base_city AS "city",
                  distance_pref AS "distancePref"
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

  /** Register user with data.
   *
   * Returns { username, firstName, email, city, distancePref }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(
      { username, password, firstName, email, city, distancePref }) {
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
            distance_pref)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, fname AS "firstName", email, base_city AS "city", distance_pref AS "distancePref"`,
        [
          username,
          hashedPassword,
          firstName,
          email,
          city,
          distancePref
        ],
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, firstName, email, city, distancePref }, ...]
   **/

  static async findAll() {
    const result = await db.query(
          `SELECT username,
                  fname AS "firstName",
                  email,
                  base_city AS "city",
                  distance_pref AS "distancePref"
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, firstName, artists, events }
   *   where artists is { id, artist_name }
   *   and events is {id, event_name}
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
          `SELECT username,
                  fname AS "firstName"
           FROM users
           WHERE username = $1`,
        [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userArtistsRes = await db.query(
          `SELECT ua.artist_id
           FROM users_artists ua
           WHERE ua.username = $1`, [username]);

    user.artists = userArtistsRes.rows.map(a => a.artist_id);
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, password, email, city, distancePref }
   *
   * Returns { username, firstName, email, city, distancePref }
   *
   * Throws NotFoundError if not found.
   *
   */

  // static async update(username, data) {
  //   if (data.password) {
  //     data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
  //   }

  //   const { setCols, values } = sqlForPartialUpdate(
  //       data,
  //       {
  //         firstName: "first_name",
  //         lastName: "last_name",
  //         isAdmin: "is_admin",
  //       });
  //   const usernameVarIdx = "$" + (values.length + 1);

  //   const querySql = `UPDATE users 
  //                     SET ${setCols} 
  //                     WHERE username = ${usernameVarIdx} 
  //                     RETURNING username,
  //                               first_name AS "firstName",
  //                               last_name AS "lastName",
  //                               email,
  //                               is_admin AS "isAdmin"`;
  //   const result = await db.query(querySql, [...values, username]);
  //   const user = result.rows[0];

  //   if (!user) throw new NotFoundError(`No user: ${username}`);

  //   delete user.password;
  //   return user;
  // }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /** Apply for job: update db, returns undefined.
   *
   * - username: username applying for job
   * - jobId: job id
   **/

  // static async applyToJob(username, jobId) {
  //   const preCheck = await db.query(
  //         `SELECT id
  //          FROM jobs
  //          WHERE id = $1`, [jobId]);
  //   const job = preCheck.rows[0];

  //   if (!job) throw new NotFoundError(`No job: ${jobId}`);

  //   const preCheck2 = await db.query(
  //         `SELECT username
  //          FROM users
  //          WHERE username = $1`, [username]);
  //   const user = preCheck2.rows[0];

  //   if (!user) throw new NotFoundError(`No username: ${username}`);

  //   await db.query(
  //         `INSERT INTO applications (job_id, username)
  //          VALUES ($1, $2)`,
  //       [jobId, username]);
  // }
}


module.exports = User;

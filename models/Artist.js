"use strict"

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
  } = require("../errors");

  class Artist {

    /** Adds a new artist:
     *  If already in users_artist for this user, throw error.
     *  If not:
     *          - add artist to artist table if not already there 
     *          - add to users_artists table
     *          - return {user_id, artist_id} or Error
     *  
     *  Receives {data: artistId, artistName, userId}
    */

    static async addArtist( data ) {
        // check users_artists for duplicate
        const duplicateUsersArtistsCheck = await db.query(
            `SELECT *
             FROM users_artists            
             WHERE (user_id = $1 AND artist_id = $2)`,
             [data.userId, data.artistId]
        );
        if (duplicateUsersArtistsCheck.rows[0]) {
            throw new BadRequestError (`Duplicate record in users_artists.`);
        }

        // look for duplicate artist id in artists table
        const duplicateArtistCheck = await db.query(
            `SELECT id
             FROM artists
             WHERE id = $1`,
             [data.artistId]
        );
        // if artist is not already in artists table, add it
        if (!duplicateArtistCheck.rows[0]) {
            await db.query(
                `INSERT INTO artists (id, artist_name)
                 VALUES ($1, $2)
                 RETURNING id, artist_name AS "name"`,
                 [data.artistId, data.artistName]    
            );
        }

        // add item to users_artists table
        const userArtistRes = await db.query(
            `INSERT INTO users_artists (user_id, artist_id)
             VALUES ($1, $2)
             RETURNING user_id, artist_id`,
             [data.userId, data.artistId]
        );
        const artist = userArtistRes.rows[0];
        if (!artist) throw new Error (`Could not add to users_artists.`)

        return artist;
    }

    /** Given an artist id, return artist name.
    *
    *   Throws NotFoundError if artist not found.
    **/

    static async getArtist(id) {
        const artistRes = await db.query(
            `SELECT id, artist_name
            FROM artists
            WHERE id = '${id}'`
        );
        const artist = artistRes.rows[0];

        if (!artist) throw new NotFoundError(`No artist with id ${id}`);

        return artist;
    }
}

  module.exports = Artist;
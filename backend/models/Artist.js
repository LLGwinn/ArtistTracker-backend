"use strict"

const db = require("../db");
const {
    NotFoundError,
    BadRequestError,
  } = require("../errors");

  class Artist {

    /** Adds a new artist to db 
     *  
     *  Returns { id: id, artist_name: name }
    */

    static async addArtist( {id, name} ) {
        const newArtistRes = await db.query(
            `INSERT INTO artists (id, artist_name)
             VALUES ($1, $2)
             RETURNING id, artist_name AS "name"`,
             [id, name]    
        );

        return newArtistRes.rows[0];
    }

    /** Given an artist id, return artist name.
    *
    *    Throws NotFoundError if artist not found.
    **/

    static async getArtist(id) {
        const artistRes = await db.query(
            `SELECT id,
                    artist_name
            FROM artists
            WHERE id = $1`,
            [id],
        );

        const artist = artistRes.rows[0];

        if (!artist) throw new NotFoundError(`No artist with id ${id}`);

        return artist;
    }

    /** Remove artist with given id from db.
     * 
     *  Returns undefined
     */

    static async removeArtist(id) {
        const result = await db.query(
            `DELETE FROM artists
             WHERE id=$1
             RETURNING id`,
             [id]
        )
        const artist = result.rows[0];

        if (!artist) throw new NotFoundError(`Cannot remove. No artist with id ${id}`);

        return artist;
    }
  }

  module.exports = Artist;
"use strict";

/** Routes for artists. */

const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const Artist = require("../models/Artist");

const router = express.Router();

/** POST /artists/add { artist }  => { artist }
 *
 *  Adds new artist to the artists table and to users-artists table.
 *  Returns newly created artist: { artist: { id, artist_name } }
 *  
 **/

 router.post("/add", async function (req, res, next) {
    try {
      const artist = await Artist.addArtist(req.body);
      return res.status(201).json( {artist} );
    } catch (err) {
      return next(err);
    }
  });


/** GET /artists/[id] => { artist }
 * 
 *  Returns { artist: id, artist_name }
 * 
 **/

router.get("/:id", async function (req, res, next) {
    try {
      console.log('at /artists/:id')
      const artist = await Artist.getArtist(req.params.id);
      return res.json({artist});
    } catch (err) {
      return next(err);
    }
});


/** DELETE /artists/[id]  =>  { deleted: id }
 *
 *  Authorization required: admin
 **/

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
      await Artist.removeArtist(req.params.id);
      return res.json({ deleted_artist: req.params.id });
    } catch (err) {
      return next(err);
    }
  });

  module.exports = router;
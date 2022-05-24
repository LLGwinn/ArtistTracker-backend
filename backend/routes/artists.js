"use strict";

const express = require("express");
const Artist = require("../models/Artist");

const router = express.Router();

/** POST /artists/add { artist }  => { artist: id, artist_name }
 *
 *  Adds new artist to the artists table and to users-artists table if not duplicate.
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


/** GET /artists/[id] => { artist: id, artist_name }
 * 
 **/

router.get("/:id", async function (req, res, next) {
    try {
      const artist = await Artist.getArtist(req.params.id);
      return res.json({artist});
    } catch (err) {
      return next(err);
    }
});

  module.exports = router;
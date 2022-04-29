"use strict";

/** Routes for artists. */

const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../errors");
const Artist = require("../models/Artist");

const router = express.Router();

/** POST /artists { artist }  => { artist }
 *
 *  Adds new artist.
 *  Returns newly created artist: { artist: { id, artist_name } }
 *  
 **/

 router.post("/", async function (req, res, next) {
    try {
      const artist = await Artist.addArtist(req.body);
      return res.status(201).json( {artist} );
    } catch (err) {
      return next(err);
    }
  });


/** GET artists/[id] => { artist }
 * 
 *  Returns { id, artist_name }
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
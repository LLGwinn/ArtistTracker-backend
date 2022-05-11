"use strict";

/** Routes for external API calls. */

const express = require("express");
const ApiCalls = require("../models/ApiCalls");

const router = express.Router();

/**
 *  GET /search/artistsbyName [searchTerm] => {artists: [...]}
 *  
 *  Returns array of artists with name matching searchTerm.
 */

router.get("/artistsByName", async function (req, res, next) {
    try {
      const artistName = req.query.artist;

      const artist = await ApiCalls.getArtistsByKeyword(artistName);

      return res.json({artist});
    } catch (err) {
      return next(err);
    }
});

/**
 *  GET /search/artistsbyId [id] => {artists: [...]}
 *  
 *  Returns details for artist with given id.
 */

 router.get("/artistById", async function (req, res, next) {
  try {
    const artistId = req.query.artistId;
    const artist = await ApiCalls.getArtistById(artistId);

    return res.json({artist});
  } catch (err) {
    return next(err);
  }
});

/**
 *  GET /search/events [artistId, city, radius] => {events: [...]}
 *  
 *  Returns array of events with radius of city for artist.
 */

router.get("/events", async function (req, res, next) {
  try {
    // sample artist:"K8vZ917G4u0" Luke Bryan
    const {id, lat, long, radius} = req.query;

    const geohash = await ApiCalls.getGeohash(lat, long);
    const events = await ApiCalls.getEvents(id, geohash, radius);

    return res.json({events})
  } catch(err) {
    return next(err);
  }
})

router.get("/cities", async function (req, res,next) {
  try {
    const city = req.query.city;
    const cities = await ApiCalls.getCities(city);
    return res.json({cities});
  } catch(err) {
    return next(err);
  }
})

module.exports = router;
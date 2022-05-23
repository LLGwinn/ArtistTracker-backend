"use strict";

/** Routes for external API calls. */

const express = require("express");
const ApiCalls = require("../models/ApiCalls");

const router = express.Router();

/**
 *  GET /search/artistsbyName {searchTerm} => {artists: [...]}
 *  
 *  Returns array of artists with name matching searchTerm.
 */

router.get("/artistsByName", async function (req, res, next) {
    try {
      const artistName = req.query.artist;
      const artists = await ApiCalls.getArtistsByKeyword(artistName);

      return res.json({artists});
    } catch (err) {
      return next(err);
    }
});

/**
 *  GET /search/artistbyId {id} => {artist: [...]}
 *  
 *  Returns details for artist with given id.
 */

 router.get("/artistById", async function (req, res, next) {
  async function fetchArtist() {
  try {
    const artistId = req.query.artistId;
    const artist = await ApiCalls.getArtistById(artistId);

    return res.json({artist});
  } catch (err) {
    return next(err);
  }
  }
  setTimeout(fetchArtist, 500);
});

/**
 *  GET /search/events {artistId, city, radius} => {events: [...]}
 *  
 *  Returns array of events within radius of city for artist.
 */

router.get("/events", async function (req, res, next) {
  try {
    const {id, lat, long, radius} = req.query;

    const geohash = await ApiCalls.getGeohash(lat, long);
    const events = await ApiCalls.getEvents(id, geohash, radius);

    return res.json({events})
  } catch(err) {
    return next(err);
  }
})

/**
 *  GET /search/cities {str} => {cities: [...]}
 *  
 *  Returns array of cities with name matching str.
 */

router.get("/cities", async function (req, res,next) {
  try {
    const city = req.query.city;
    const cities = await ApiCalls.getCities(city);
    return res.json({cities});
  } catch(err) {
    return next(err);
  }
})

/**
 *  GET /search/city/[id]  => {city: [...]}
 *  
 *  Returns city data with for city with given id.
 */

router.get("/city/:id", async function (req, res,next) {
  try {
    const {id} = req.params;
    const city = await ApiCalls.getCity(id);
    return res.json({city});
  } catch(err) {
    return next(err);
  }
})

module.exports = router;
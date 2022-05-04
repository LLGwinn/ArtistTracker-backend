"use strict";
const axios = require('axios');
const TICKETMASTER_API_KEY = require('../config');
const baseURL = 'https://app.ticketmaster.com';

/** Routes for external API calls. */

const express = require("express");
const ApiCalls = require("../models/ApiCalls");
const { json } = require('express');

const router = express.Router();

/**
 *  GET /search/artists [searchTerm] => {artists: [...]}
 *  
 *  Returns array of artists.
 */

router.get("/artists", async function (req, res, next) {
    try {
      const artistName = req.query.artistName;

      const artists = await ApiCalls.getArtistsByKeyword(artistName);

      return res.json({artists});
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
    const id = req.query.id;
    const city = req.query.city;
    const radius = req.query.radius;

    const events = await ApiCalls.getEvents(id, city, radius);

    return res.json({events})
  } catch(err) {
    return next(err);
  }
})

module.exports = router;
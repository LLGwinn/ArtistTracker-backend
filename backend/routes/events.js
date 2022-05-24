"use strict";

const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

/** POST /events/add { event, UserId }  => { event: user_id, event_id }
 *
 *  Adds new event to events and events_artists if not duplicate.
 *  
 **/

 router.post("/add", async function (req, res, next) {
    try {
      const event = await Event.addEvent(req.body.event, req.body.userId);
      return res.status(201).json( {event} );
    } catch (err) {
      return next(err);
    }
  });


/** GET events/[id] => { event: ...all the event data } **/

router.get("/:id", async function (req, res, next) {
    try {
      const event = await Event.getEvent(req.params.id);
      return res.json({ event });
    } catch (err) {
      return next(err);
    }
  });

  module.exports = router;
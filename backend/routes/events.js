"use strict";

/** Routes for events. */

const express = require("express");
const { ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../errors");
const Event = require("../models/Event");

const router = express.Router();

/** POST /events/add { event, UserId }  => { event }
 *
 *  Adds new event to events and events_artists if not duplicate.
 *  
 **/

 router.post("/add", async function (req, res, next) {
    try {
      const message = await Event.addEvent(req.body);
      return res.status(201).json( message );
    } catch (err) {
      return next(err);
    }
  });


/** GET events/[id] => { event }
 * 
 *  Returns { id, event_name }
 * 
 **/

router.get("/:id", async function (req, res, next) {
    try {
      const event = await Event.getEvent(req.params.id);
      return res.json({ event });
    } catch (err) {
      return next(err);
    }
  });


/** DELETE /events/[id]  =>  { deleted: id }
 *
 *  Authorization required: admin
 **/

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
      const message = await Artist.removeEvent(req.params.id);
      return res.json( message )
    } catch (err) {
      return next(err);
    }
  });

  module.exports = router;
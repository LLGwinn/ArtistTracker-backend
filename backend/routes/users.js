"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../errors");
const User = require("../models/User");
const { createToken } = require("../helpers/token");
const newUserSchema = require("../schemas/user-new.json");
const updateUserSchema = require("../schemas/user-update.json");

const router = express.Router();


/** PATCH /users/[id] => { user }
 *
 * Data can include:
 *   { username, firstName, password, email, city, radius }
 *
 * Returns { id, username, firstName, email, city, radius, isAdmin }
 *
 * Authorization required: must be logged in as correct user or admin.
 **/

router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, updateUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.updateUser(+req.params.id, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /users/[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.removeUser(+req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

  
/** GET /users/[userId]/artists  => {artists: [...]} 
 * 
 *  Gets list of user's saved artists.
*/

router.get("/:id/artists", async function (req, res, next) {
  try {
    const artists = await User.findUserArtists(req.params.id);
    return res.json({artists})
  } catch(err) {
    return next(err);
  }
});


/** DELETE /users/[userId]/artists {artistId}  => {deleted: artist_name from username} 
 * 
 *  Removes record from users_artists for given user/artist.
 * 
 *  Authorization required: admin or same-user-as-:username
*/

router.delete("/:id/artists", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.deleteUserArtist(req.params.id, req.body.artistId);
    return res.json({deleteMessage: 'Removed artist from your favorites.'})
  } catch(err) {
    return next(err);
  }
});

/** GET /users/:id/events  => {events: [...]}
 * 
 *  Gets list of user's saved events.
*/

router.get("/:id/events", async function (req, res, next) {
  try {
    const events = await User.findUserEvents(+req.params.id);
    return res.json({events})
  } catch(err) {
    return next(err);
  }
});

/** DELETE /users/[userId]/events  => {deleted: event} 
 * 
 *  Removes record from users_events for given user/event.
 * 
 *  Authorization required: admin or same-user-as-:username
*/

router.delete("/:id/events", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.deleteUserEvent(req.params.id, req.body.eventId);
    return res.json({deleteMessage: 'Event deleted from your saved events.'})
  } catch(err) {
    return next(err);
  }
});

module.exports = router;

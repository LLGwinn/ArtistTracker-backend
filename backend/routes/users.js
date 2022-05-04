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


/** POST /users/ { user }  => { user, token }
 *
 *  Adds new user. This is not the registration endpoint!
 *  This is only for admin users to add new users. 
 *  New user being added can be an admin.
 *
 *  Returns newly created user and an authentication token for them:
 *  {user: { username, firstName, email, city, distancePref, isAdmin }, token }
 *
 *  Authorization required: admin
 *  
 **/

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET /users => { users: [ {username, firstName, lastName, email }, ... ] }
 *  Returns list of all users.
 *
 *  Authorization required: admin
 **/

 router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAllUsers();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET users/[id] => { user }
 *  Returns { username, firstName, email, city, distancePref, isAdmin, artists, events }
 *        where artist is { artist_id, artist_name } and event is {event_id, event_name} 
 * TODO: How do I list the artists and events?
 * Authorization required: must be logged in as correct user or as admin.
 **/

router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.getUser(+req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /users/[id] { user } => { user }
 *
 * Data can include:
 *   { firstName, password, email, city, distancePref }
 *
 * Returns { username, firstName, email, city, distancePref, isAdmin }
 *
 * Authorization required: must be logged in as correct user or as admin.
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


/** DELETE /users/[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.removeUser(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


/** POST /[username]/jobs/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

// router.post("/:username/jobs/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
//   try {
//     const jobId = +req.params.id;
//     await User.applyToJob(req.params.username, jobId);
//     return res.json({ applied: jobId });
//   } catch (err) {
//     return next(err);
//   }
// });



module.exports = router;

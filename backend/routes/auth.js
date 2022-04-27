"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/User");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const authUserSchema = require("../schemas/user-auth.json");
const registerUserSchema = require("../schemas/user-register.json");
const { BadRequestError } = require("../errors");


/** POST /auth/token:  { username, password } => { token }
 *  Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, authUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 *  (user must include { username, password, firstName, email, city, distancePref } )
 *
 *  Returns JWT token which can be used to authenticate further requests.
 *
 *  Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, registerUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    console.log('newUser in /register in auth.js:', newUser)
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;

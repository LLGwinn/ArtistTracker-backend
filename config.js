"use strict";

//require("dotenv").config({path:__dirname+'/home/ells/Bootcamp/ArtistTracker-backend.env'});
//require("dotenv").config({path:__dirname+'.env'});
//require("dotenv").config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-capstone2";

const PORT = +process.env.PORT || 3001; 

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const GEOCITIES_API_KEY = process.env.GEOCITIES_API_KEY;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "artist_tracker_test"
      : process.env.DATABASE_URL || "artist_tracker";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("PORT:".yellow, PORT.toString());
console.log("Database:".yellow, getDatabaseUri());

module.exports = {
  SECRET_KEY,
  PORT,
  TICKETMASTER_API_KEY,
  GEOCITIES_API_KEY,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
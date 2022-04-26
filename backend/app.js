"use strict";

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./errors");

// const { authenticateJWT } = require("./middleware/auth");
// const authRoutes = require("./routes/auth");
// const companiesRoutes = require("./routes/companies");
// const usersRoutes = require("./routes/users");
// const jobsRoutes = require("./routes/jobs");

//const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
//app.use(morgan("tiny"));
//app.use(authenticateJWT);

// app.use("/auth", authRoutes);
// app.use("/companies", companiesRoutes);
// app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler for any unhandled errors. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
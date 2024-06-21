const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); // routes for catalog area of site

const app = express();

// MongoDB connection setup
const env = require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.dbConnectionString;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// compress all routes
app.use(compression());

// add helmet to the middleware chain; set CSP header to allow Bootstrap/jQuery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["cdn.jsdelivr.net", "code.jquery.com", "self"],
    },
  })
);

// set up rate limiter: max 40 requests per minute
const limit = RateLimit({ windowMs: 1 * 60 * 1000, max: 40 });
//apply rate limiter to all requests
app.use(limit);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // add catalog routes to middleware chain

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// list all Genre
exports.genre_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: genre list`);
  let genres = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("genre_list", { title: "Genre List", genres: genres });
});

// GET details of a specific Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: genre detail ${req.params.id}`);
  const [genreName, relatedbooks] = await Promise.all([
    Genre.findOne({ _id: req.params.id }).exec(),
    Book.find({ genre: req.params.id }).sort({ title: 1 }).exec(),
  ]);

  if (!genreName) {
    const err = new Error(`Genre not found`);
    err.status = 404;
    return next(err);
  }
  console.log(`genre id: ${req.params.id} | ${genreName} | ${relatedbooks}`);
  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genreName,
    relatedbooks: relatedbooks,
  });
});

// GET form to create Genre
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", {
    title: "Create Genre",
    genre: null,
    errors: null,
  });
});

// POST form to handle create Genre
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // res.send(`NOT IMPLEMENTED: genre create POST`);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      console.log(`genre: ${genre}`);
      errors.array().map((e) => console.log(e));
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// GET form to DELETE Genre
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre delete GET`);
});

// POST form to handle delete Genre
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre delete POST`);
});

// GET form to update Genre
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre update GET`);
});

// POST form to update Genre
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre update POST`);
});

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
  const [relatedBooks, genre] = await Promise.all([
    Book.find({ genre: req.params.id }).sort({ title: 1 }).exec(),
    Genre.findOne({ _id: req.params.id }).exec(),
  ]);
  if (!genre) {
    res.redirect("/catalog/genres");
  }
  res.render("genre_delete", {
    title: "Delete Genre",
    relatedbooks: relatedBooks,
    genre: genre,
  });
});

// POST form to handle delete Genre
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [relatedBooks, genre] = await Promise.all([
    Book.find({ genre: req.params.id }).sort({ title: 1 }).exec(),
    Genre.findOne({ _id: req.params.id }).exec(),
  ]);
  if (!genre) {
    res.redirect("/catalog/genres");
    return;
  } else if (relatedBooks.length > 0) {
    res.render("genre_delete", {
      title: "Delete Genre",
      relatedbooks: relatedBooks,
      genre: genre,
    });
    return;
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});

// GET form to update Genre
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genreName = await Genre.findOne({ _id: req.params.id }).exec();

  if (!genreName) {
    const err = new Error(`Genre not found`);
    err.status = 404;
    return next(err);
  }
  console.log(`genre id: ${req.params.id} | ${genreName}`);
  res.render("genre_form", {
    title: "Update Genre",
    genre: genreName,
    errors: null,
  });
});

// POST form to update Genre
exports.genre_update_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data, but keep the same genre._id
    const genre = new Genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Update Genre",
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
        const updatedGenre = await Genre.findByIdAndUpdate(
          req.params.id,
          genre,
          {}
        );
        // New genre saved. Redirect to genre detail page.
        res.redirect(updatedGenre.url);
      }
    }
  }),
];

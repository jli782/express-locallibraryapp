const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// lists all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: author list`);
  let authors = await Author.find({}).exec();
  console.log(authors);
  res.render("author_list", { title: "List of Authors", authors: authors });
});

// detail page for a specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, relatedBooks] = await Promise.all([
    await Author.findById(req.params.id).exec(),
    await Book.find({ author: req.params.id }).exec(),
  ]);
  console.log(relatedBooks);
  if (!author) {
    const err = new Error("Author not found.");
    res.status = 404;
    return next(err);
  }
  res.render("author_detail", {
    title: `${author.family_name}, ${author.first_name}`,
    author: author,
    authorBooks: relatedBooks,
  });
});

// GET the form to create author
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render("author_form", {
    title: "Create Author",
    author: null,
    errors: null,
  });
});

// POST the form to handle create author
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required.")
    .isAlphanumeric()
    .withMessage("First name must not have non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required.")
    .isAlphanumeric()
    .withMessage("First name must not have non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_date", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    // res.send(`NOT IMPLEMENTED: author create POST`);
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    if (!errors.isEmpty()) {
      errors.array().map((e) => console.log(e));
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
    } else {
      // save the new Author to database
      const authorExists = await Author.findOne({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
      }).exec();
      console.log(`authorExists: ${authorExists}`);
      if (authorExists) {
        res.redirect(authorExists.url);
      } else {
        await author.save();
        res.redirect(author.url);
      }
    }
  }),
];

// GET form to delete author
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary")
      .sort({ title: 1 })
      .exec(),
  ]);

  if (!author) {
    // no author found in database
    res.redirect("/catalog/authors");
  }
  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  });
});

// POST the form to handle delete author
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  // get details of author and all their books in parallel
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary")
      .sort({ title: 1 })
      .exec(),
  ]);

  if (!author) {
    res.redirect("/catalog/authors");
    return;
  } else if (allBooksByAuthor.length > 0) {
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }
});

// GET form to update author
exports.author_update_get = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id).exec();

  console.log(author);
  if (!author) {
    const err = new Error("Author not found.");
    res.status = 404;
    return next(err);
  }
  res.render("author_form", {
    title: `Update Author`,
    author: author,
    errors: null,
  });
});

// POST the form to handle update author
exports.author_update_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required.")
    .isAlphanumeric()
    .withMessage("First name must not have non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required.")
    .isAlphanumeric()
    .withMessage("First name must not have non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth.")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_date", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });
    console.log("POST: ", author);
    if (!errors.isEmpty()) {
      errors.array().map((e) => console.log(e));
      res.render("author_form", {
        title: "Update Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Update the new Author to database
      const updatedAuthor = await Author.findByIdAndUpdate(
        req.params.id,
        author,
        {}
      ).exec();
      res.redirect(updatedAuthor.url);
    }
  }),
];

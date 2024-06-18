const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  /* res.send(`NOT IMPLEMENTED: site home page`); */

  const [
    numBooks,
    numAuthors,
    numBookInstances,
    numAvailableBookInstances,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    Author.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Genre.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Library Site Home Page",
    book_count: numBooks,
    author_count: numAuthors,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    genre_count: numGenres,
  });
});

// list all books
exports.book_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Book list`);
  let books = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();
  res.render("book_list", { title: "Book List", books: books });
});

// detail page for a specific book
exports.book_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Book detail ${req.params.id}`);
  const [copies, detail] = await Promise.all([
    BookInstance.find({ book: req.params.id }).sort({ status: 1 }).exec(),
    Book.findOne({ _id: req.params.id })
      .populate("author")
      .populate("genre")
      .exec(),
  ]);

  if (!detail) {
    const err = new Error(`Book not found`);
    err.status = 404;
    return next(err);
  }
  console.log(copies, detail);
  res.render("book_detail", {
    title: detail.title,
    book_copies: copies,
    book_detail: detail,
  });
});

// GET form to create book
exports.book_create_get = asyncHandler(async (req, res, next) => {
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);
  console.log(allAuthors);
  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
    book: null,
    errors: null,
  });
});

// POST form to create book
exports.book_create_post = [
  (req, res, next) => {
    // convert the genre in req to an array so it can be validated/sanitized
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });
    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      // mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) genre.checked = "true";
      }
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

// GET form to delete book
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  const [copies, detail] = await Promise.all([
    BookInstance.find({ book: req.params.id }).sort({ status: 1 }).exec(),
    Book.findOne({ _id: req.params.id })
      .populate("author")
      .populate("genre")
      .exec(),
  ]);

  if (!detail) {
    res.redirect("/catalog/books");
  }
  console.log(copies, detail);
  res.render("book_delete", {
    title: "Delete book",
    book_copies: copies,
    book_detail: detail,
  });
});

// POST form to delete book
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  const [copies, detail] = await Promise.all([
    BookInstance.find({ book: req.params.id }).sort({ status: 1 }).exec(),
    Book.findOne({ _id: req.params.id })
      .populate("author")
      .populate("genre")
      .exec(),
  ]);

  if (!detail) {
    res.redirect("/catalog/books");
  } else if (copies.length > 0) {
    res.render("book_delete", {
      title: "Delete book",
      book_copies: copies,
      book_detail: detail,
    });
  } else {
    await Book.findByIdAndDelete(req.body.bookid);
    res.redirect("/catalog/books");
  }
});

// GET form to update book
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book update GET`);
});

// POST form to update book
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book update POST`);
});

const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

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
  res.send(`NOT IMPLEMENTED: Book create GET`);
});

// POST form to create book
exports.book_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book create POST`);
});

// GET form to delete book
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book delete GET`);
});

// POST form to delete book
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book delete POST`);
});

// GET form to update book
exports.book_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book update GET`);
});

// POST form to update book
exports.book_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book update POST`);
});

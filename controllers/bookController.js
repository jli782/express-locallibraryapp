const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  //   res.render("index", { title: "Site Home Page" });
  res.send(`NOT IMPLEMENTED: site home page`);
});

// list all books
exports.book_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book list`);
});

// detail page for a specific book
exports.book_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book detail ${req.params.id}`);
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

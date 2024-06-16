const Author = require("../models/author");
const asyncHandler = require("express-async-handler");

// lists all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: author list`);
  let authors = await Author.find({}).exec();
  console.log(authors);
  res.render("author_list", { title: "List of Authors", authors: authors });
});

// detail page for a specific author
exports.author_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author details ${req.params.id}`);
});

// GET the form to create author
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author create GET`);
});

// POST the form to handle create author
exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author create POST`);
});

// GET form to delete author
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author delete GET`);
});

// POST the form to handle delete author
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author delete POST`);
});

// GET form to update author
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author update GET`);
});

// POSTT the form to handle update author
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: author update POST`);
});

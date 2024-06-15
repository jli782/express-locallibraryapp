const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");

// list all BookInstances
exports.bookInstance_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance list`);
});

// detail page for a specific BookInstance
exports.bookInstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance details ${req.params.id}`);
});

// GET form to create BookInstance
exports.bookInstance_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance create GET`);
});

// POST form to handle create BookInstance
exports.bookInstance_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance create POST`);
});

// GET form to delete BookInstance
exports.bookInstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance delete GET`);
});

// POST form to delete BookInstance
exports.bookInstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance delete POST`);
});

// GET form to update BookInstance
exports.bookInstance_update_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance update GET`);
});

// POST form to handle update BookInstance
exports.bookInstance_update_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: BookInstance update POST`);
});

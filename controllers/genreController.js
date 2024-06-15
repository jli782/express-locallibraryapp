const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

// list all Genre
exports.genre_list = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre list`);
});

// GET details of a specific Genre
exports.genre_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre detail ${req.params.id}`);
});

// GET form to create Genre
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre create GET`);
});

// POST form to handle create Genre
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: genre create POST`);
});

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

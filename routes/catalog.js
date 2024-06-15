const express = require("express");
const router = express.Router();

// require controller modules
const book_controller = require("../controllers/bookController");
const author_controller = require("../controllers/authorController");
const genre_controller = require("../controllers/genreController");
const book_instance_controller = require("../controllers/bookinstanceController");

// Book routes
router.get("/", book_controller.index);
router.get("/book/create", book_controller.book_create_get);
router.post("/book/create", book_controller.book_create_post);
router.get("/book/:id/delete", book_controller.book_delete_get);
router.post("/book/:id/delete", book_controller.book_delete_post);
router.get("/book/:id/update", book_controller.book_update_get);
router.post("/book/:id/update", book_controller.book_update_post);
router.get("/book/:id", book_controller.book_detail);
router.get("/books", book_controller.book_list);

// Author routes
// NOTE: author_create_get must come BEFORE route for id (GET details of specific author)
router.get("/author/create", author_controller.author_create_get);
router.post("/author/create", author_controller.author_create_post);
router.get("/author/:id/delete", author_controller.author_delete_get);
router.post("/author/:id/delete", author_controller.author_delete_post);
router.get("/author/:id/update", author_controller.author_update_get);
router.post("/author/:id/update", author_controller.author_update_post);
router.get("/author/:id", author_controller.author_detail);
router.get("/authors", author_controller.author_list);

// Genre routes
router.get("/genre/create", genre_controller.genre_create_get);
router.post("/genre/create", genre_controller.genre_create_post);
router.get("/genre/:id/delete", genre_controller.genre_delete_get);
router.post("/genre/:id/delete", genre_controller.genre_delete_post);
router.get("/genre/:id/update", genre_controller.genre_update_get);
router.post("/genre/:id/update", genre_controller.genre_update_post);
router.get("/genre/:id", genre_controller.genre_detail);
router.get("/genres", genre_controller.genre_list);

// BookInstance routes
router.get(
  "/bookinstance/create",
  book_instance_controller.bookInstance_create_get
);
router.post(
  "/bookinstance/create",
  book_instance_controller.bookInstance_create_post
);
router.get(
  "/bookinstance/:id/delete",
  book_instance_controller.bookInstance_delete_get
);
router.post(
  "/bookinstance/:id/delete",
  book_instance_controller.bookInstance_delete_post
);
router.get(
  "/bookinstance/:id/update",
  book_instance_controller.bookInstance_update_get
);
router.post(
  "/bookinstance/:id/update",
  book_instance_controller.bookInstance_update_post
);
router.get("/bookinstance/:id", book_instance_controller.bookInstance_detail);
router.get("/bookinstances", book_instance_controller.bookInstance_list);

module.exports = router;

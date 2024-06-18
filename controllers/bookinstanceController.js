const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// list all BookInstances
exports.bookInstance_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: BookInstance list`);
  let book_instances = await BookInstance.find({})
    .populate("book")
    .sort({ book: 1 })
    .exec();
  console.log(book_instances);
  res.render("book_instance_list", {
    title: "List of available copies",
    book_instances: book_instances,
  });
});

// detail page for a specific BookInstance
exports.bookInstance_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: BookInstance details ${req.params.id}`);
  let instance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  console.log(instance);
  if (!instance) {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }
  res.render("book_instance_detail", {
    title: instance._id,
    book_instance: instance,
  });
});

// GET form to create BookInstance
exports.bookInstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  res.render("book_instance_form", {
    title: "Create BookInstance",
    book_list: allBooks,
    errors: null,
    selected_book: undefined,
    bookInstance: null,
  });
});

// POST form to handle create BookInstance
exports.bookInstance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("imprint", "Imprint must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
      errors.array().map((e) => console.log(e));
      res.render("book_instance_form", {
        title: "Create BookInstance",
        book_list: allBooks,
        errors: errors.array(),
        selected_book: bookInstance.book._id,
        bookInstance: bookInstance,
        selected_book_status: bookInstance.status,
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }
  }),
];

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

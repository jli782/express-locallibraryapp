const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("bookinstance");
// list all BookInstances
exports.bookInstance_list = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: BookInstance list`);
  let book_instances = await BookInstance.find({})
    .populate("book")
    .sort({ book: 1 })
    .exec();
  debug(`on bookInstance_list: `, book_instances);
  res.render("book_instance_list", {
    title: "List of available copies",
    book_instances: book_instances,
  });
});

// detail page for a specific BookInstance
exports.bookInstance_detail = asyncHandler(async (req, res, next) => {
  let instance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  // debug(`on bookInstance_detail: `, instance);
  if (!instance) {
    debug(`on bookInstance_detail: Book ${req.params.id} not found!`);
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
      imprint: req.body.imprint
        .replaceAll("&#x2F;", "/")
        .replaceAll("&amp;", "&"),
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
      errors
        .array()
        .map((e) => debug(`on bookInstance_create_post error: ${e.msg}`));
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
  let instance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  debug(`on bookInstance_delete_get: `, instance);
  if (!instance) {
    debug(
      `on bookInstance_delete_get: bookinstance ${req.params.id} not found!`
    );
    res.redirect("/catalog/book/" + instance.book._id);
    return;
  }
  res.render("book_instance_delete", {
    title: "Delete instance",
    book_instance: instance,
  });
});

// POST form to delete BookInstance
exports.bookInstance_delete_post = asyncHandler(async (req, res, next) => {
  let instance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  if (!instance) {
    debug(
      `on bookInstance_delete_post: bookinstance ${req.params.id} no found!`
    );
    res.redirect("/catalog/book/" + instance.book._id);
    return;
  } else {
    await BookInstance.findByIdAndDelete(req.body.bookinstanceid);
    res.redirect("/catalog/book/" + instance.book._id);
  }
});

// GET form to update BookInstance
exports.bookInstance_update_get = asyncHandler(async (req, res, next) => {
  const [allBooks, bookInstance] = await Promise.all([
    Book.find({}, "title").sort({ title: 1 }).exec(),
    BookInstance.findById(req.params.id).populate("book").exec(),
  ]);
  debug(`on bookInstance_update_get: `, bookInstance);
  if (!bookInstance) {
    debug(
      `on bookInstance_update_get: bookinstance ${req.params.id} not found!`
    );
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("book_instance_form", {
    title: "Update BookInstance",
    book_list: allBooks,
    errors: null,
    selected_book: bookInstance.book._id,
    bookInstance: bookInstance,
    selected_book_status: bookInstance.status,
  });
});

// POST form to handle update BookInstance
exports.bookInstance_update_post = [
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
      imprint: req.body.imprint
        .replaceAll("&#x2F;", "/")
        .replaceAll("&amp;", "&"),
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
      errors
        .array()
        .map((e) => debug(`on bookInstance_update_post error: `, e.msg));
      res.render("book_instance_form", {
        title: "Update BookInstance",
        book_list: allBooks,
        errors: errors.array(),
        selected_book: bookInstance.book._id,
        bookInstance: bookInstance,
        selected_book_status: bookInstance.status,
      });
      return;
    } else {
      const updated_bookInstance = await BookInstance.findByIdAndUpdate(
        req.params.id,
        bookInstance,
        {}
      );
      res.redirect(updated_bookInstance.url);
    }
  }),
];

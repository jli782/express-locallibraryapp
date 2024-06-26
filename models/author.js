const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  // author's full name
  // to avoid error where the author does NOT have either family or first name, return an empty string instead
  let fullname = "";
  if (this.first_name && this.family_name)
    fullname = `${this.family_name}, ${this.first_name}`;
  return fullname;
});
AuthorSchema.virtual("url").get(function () {
  // author's url
  // NOTE: no => notation for function definition because require the "this" object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("dob_dod_formatted").get(function () {
  let dob = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY
      )
    : "???";

  let dod = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY
      )
    : "???";

  let res = "";
  if (dob && dod) res = `${dob} - ${dod}`;
  else if (dob) res = `${dob} - `;
  else res = `unknown`;
  return res;
});

AuthorSchema.virtual("dob_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
  // return DateTime.fromJSDate(this.date_of_birth).toLocaleString(
  //   DateTime.DATE_SHORT
  // );
});

AuthorSchema.virtual("dod_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});
// export the model
// Mongoose compiles a model based on the AuthorSchema
// "Author" is the singular name of the collection for the AuthorSchema, on mongodb, the collection name is pluralized to "authors"
// an instance of a model is a document
module.exports = mongoose.model("Author", AuthorSchema);

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const essayModel = new schema({
  areas: Array,
  stage: String,
  question: String,
  link: String
});

module.exports = mongoose.model("Essay", essayModel);
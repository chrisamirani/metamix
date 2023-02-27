const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeSchema = new Schema(
  {},
  {
    strict: false,
  }
);

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;

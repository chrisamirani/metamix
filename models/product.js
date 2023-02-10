const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productsSchema = new Schema(
  {},
  {
    strict: false,
  }
);

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;

const express = require("express");
const compress = require("compression");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const categories = require("./categories.json");
function createSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // Trim leading and trailing spaces
  str = str.toLowerCase(); // Convert to lowercase

  // Remove characters that are not alphanumeric, whitespaces, or dashes
  str = str.replace(/[^a-z0-9\s-]/g, "");

  // Replace whitespaces and consecutive dashes with a single dash
  str = str.replace(/[\s-]+/g, "-");

  return str;
}

dotenv.config();
const app = express();
app.set("view engine", "pug");
mongoose.connect(process.env.MONGO_URI, undefined, (err) => {
  if (!err) console.log("connected to db");
});
app.get("*", (req, res, next) => {
  console.log(req.url);
  next();
});
const contactSchema = new mongoose.Schema({
  name: String,
  tel: String,
  email: String,
});

const productsSchema = new mongoose.Schema(
  {},
  {
    strict: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

const Product = mongoose.model("Product", productsSchema);

app.use(compress());
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/contact", (req, res) => {
  console.log(req.body);
  const contact = new Contact(req.body);

  contact.save((err, done) => {
    console.log(err);
    if (err) return res.status(500).json({ message: "something went wrong." });
    res.status(201).json({ message: "success" });
  });
});

app.get("/explore/:categorySlug/:subCategorySlug", async (req, res) => {
  Product.find(
    {
      "category.slug": req.params.categorySlug,
      "subCategory.slug": req.params.subCategorySlug,
      "threeDInfo.model.files": { $ne: null },
    },
    (err, products) => {
      if (!products) return res.status(404).render("404");

      res.render("explore", {
        categories,
        subCategories: categories[req.params.categorySlug],
        currentCategory: req.params.categorySlug,
        currentSubCategory: req.params.subCategorySlug,
        products,
        title: "MetaMix | Explore all furniture in AR",
      });
    }
  );
});

app.get("/", (req, res, next) => {
  res.render("index", { title: "Metamix | See Things Before You Buy" });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log("server started");
});

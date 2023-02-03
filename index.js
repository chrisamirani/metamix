const express = require("express");
const compress = require("compression");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

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

const categoriesSchema = new mongoose.Schema(
  {},
  {
    strict: false,
  }
);

const Contact = mongoose.model("Contact", contactSchema);
const Category = mongoose.model("Category", categoriesSchema);

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

app.get("/explore/:category/:subcategory", async (req, res) => {
  Category.find({}, ["category", "subCategory"]).then((categories) => {
    const all = {};

    for (i = 0; i < categories.length; i++) {
      const subCat = {
        subCategory: categories[i]._doc.subCategory,
        id: categories[i]._doc._id,
      };
      if (all[categories[i]._doc.category] != null) {
        all[categories[i]._doc.category].push(subCat);
      } else {
        all[categories[i]._doc.category] = [subCat];
      }
    }

    Category.findOne(
      { category: req.params.category, subCategory: req.params.subcategory },
      (err, products) => {
        if (!products) return res.status(404).render("404");
        res.render("explore", {
          categories: all,
          subCategories: all[req.params.category],
          currentCategory: req.params.category,
          currentSubCategory: req.params.subcategory,
          products: products._doc.products,
          title: "MetaMix | Explore all furniture in AR",
        });
      }
    );
  });
});

app.get("/", (req, res, next) => {
  res.render("index", { title: "Metamix | See Things Before You Buy" });
});

app.listen(process.env.PORT ?? 3000, () => {
  console.log("server started");
});

const router = require("express").Router();
const Product = require("../models/product");
const categories = require("../categories.json");
const authenticateUser = require("../authenticate");

router.get(
  "/explore/:categorySlug/:subCategorySlug",
  authenticateUser,
  async (req, res) => {
    const query = {
      "category.slug": req.params.categorySlug,
      "subCategory.slug": req.params.subCategorySlug,
      "threeDInfo.model.files": { $ne: null },
    };
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    Product.countDocuments(query).then((count) => {
      const totalPages = Math.ceil(count / pageSize);

      Product.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec((err, products) => {
          if (err || products.length == 0)
            return res.status(404).render("error", { code: 404 });

          res.render("explore", {
            categories,
            subCategories: categories[req.params.categorySlug],
            currentCategory: req.params.categorySlug,
            currentSubCategory: req.params.subCategorySlug,
            products,
            title: "MetaMix | Explore all furniture in AR",
            totalPages,
            activePage: page,
          });
        });
    });
  }
);

router.post("/items", authenticateUser, async (req, res) => {
  const query = {
    "subCategory.slug": req.body.slug,
    "threeDInfo.model.files": { $ne: null },
  };
  const page = parseInt(req.body.page) || 1;
  const pageSize = 10;

  Product.countDocuments(query).then((count) => {
    const totalPages = Math.ceil(count / pageSize);

    Product.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec((err, products) => {
        if (err || products.length == 0) {
          return res.status(404).json({ code: 404 });
        }
        res.json({
          products,
          totalPages,
        });
      });
  });
});

module.exports = router;

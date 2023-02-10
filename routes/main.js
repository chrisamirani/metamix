const router = require("express").Router();
const authenticateUser = require("../authenticate");

router.get("/", authenticateUser, (req, res, next) => {
  res.render("index", {
    title: "Metamix | See Things Before You Buy",
    user: req.user,
  });
});

router.get("/planner", (req, res, next) => {
  res.render("planner");
});
module.exports = router;

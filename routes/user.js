const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../authenticate");
const mongoErrors = require("../utils/mongoErrors");

router.get("/signup", authenticateUser, (req, res) => {
  if (req.user) return res.redirect("/explore/living-room-furniture/sofas");
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const user = new User(req.body);

  user.save((err, user) => {
    if (err)
      return res
        .status(500)
        .send(mongoErrors[err.code] || "Something went wrong.");
    const token = jwt.sign(
      { name: user.name, id: user.id, email: user.email },
      process.env.JWT_SECRET
    );
    res.cookie("token", token).send();
  });
});

module.exports = router;

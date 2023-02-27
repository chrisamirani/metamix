const router = require("express").Router();
const User = require("../models/user");
const Home = require("../models/home");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../authenticate");
const mongoErrors = require("../utils/mongoErrors");

router.get("/signup", authenticateUser, (req, res) => {
  if (req.user) return res.redirect("/explore/living-room-furniture/sofas");
  res.render("signup");
});

router.get("/user/rooms", authenticateUser, (req, res) => {
  //if (!req.user) return res.status(401).json({ message: "unauthorized" });
  User.findById("63faa04691d62bd2f87f87d3", ["rooms"], (err, rooms) => {
    if (err) return res.status(500).json({ message: "something went wrong" });

    Home.find({ _id: { $in: rooms.rooms } }, (err, roomsData) => {
      if (err) return res.status(500).json({ message: "something went wrong" });
      res.json(roomsData);
    });
  });
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

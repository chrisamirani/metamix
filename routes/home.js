const router = require("express").Router();
const Home = require("../models/home");
const authenticateUser = require("../authenticate");

router.get("/home/:id", authenticateUser, (req, res) => {
  if (!req.user) return res.status(401).json({ message: "unauthorized" });
  Home.findById(req.params.id, (err, home) => {
    if (err) return res.status(500).json({ message: "Something went wrong" });
    res.json(home);
  });
});

router.get("/planner", (req, res, next) => {
  res.render("planner");
});

router.post("/add-furniture", authenticateUser, (req, res) => {
  const roomId = req.body.roomId;
  const furniture = req.body.furniture;

  Home.findById(roomId, (err, room) => {
    if (room.furniture) {
      room.furniture.push(furniture);
    } else {
      room.furniture = [furniture];
    }
    room.save();
    res.send();
  });
});
module.exports = router;

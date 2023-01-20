const express = require("express");
const compress = require("compression");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI, undefined, (err) => {
  if (!err) console.log("connected to db");
});

const contactSchema = new mongoose.Schema({
  name: String,
  tel: String,
  email: String,
});

const Contact = mongoose.model("Contact", contactSchema);

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

app.listen(process.env.PORT ?? 3000, () => {
  console.log("server started");
});

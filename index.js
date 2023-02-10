const express = require("express");
const compress = require("compression");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const mainRouter = require("./routes/main");
const productRouter = require("./routes/product");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();

app.use(cookieParser());
app.set("view engine", "pug");
mongoose.connect(process.env.MONGO_URI, undefined, (err) => {
  if (!err) console.log("connected to db");
});

app.get("*", (req, res, next) => {
  console.log(req.url);
  next();
});

app.use(compress());
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(mainRouter);
app.use(userRouter);
app.use(productRouter);

app.listen(process.env.PORT ?? 3000, () => {
  console.log("server started");
});

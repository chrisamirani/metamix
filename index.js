const express = require("express");
const compress = require("compression");
const app = express();

app.use(compress());
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/contact", (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "success" });
});
app.listen(process.env.PORT ?? 3000, () => {
  console.log("server started");
});

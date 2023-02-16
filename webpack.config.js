const path = require("path");

module.exports = {
  entry: "./planner/index.js",
  output: {
    path: path.resolve(__dirname, "public", "js"),
    filename: "planner.bundle.js",
  },
};

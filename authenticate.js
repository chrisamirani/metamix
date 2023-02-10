const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  if (!req.cookies.token) return next();
  const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

  if (user.id) {
    req.user = user;
  }

  next();
};

module.exports = authenticateUser;

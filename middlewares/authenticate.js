const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const User = require("../models/user");
const { HTTPError } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HTTPError(401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HTTPError(409));
    }
    req.user = user;
    next();
  } catch {
    next(HTTPError(401));
  }
};

module.exports = authenticate;

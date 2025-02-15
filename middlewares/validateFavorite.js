const { HTTPError } = require("../helpers");

const validateFavorite = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HTTPError(400, "missing field favorite"));
    }
    next();
  };
  return func;
};
module.exports = validateFavorite;

const { addSchema } = require("./contacts");
const { updateSchema } = require("./contacts");
const { updateFavoriteSchema } = require("./contacts");
const { registrationSchema, loginSchema } = require("./users");

module.exports = {
  addSchema,
  updateSchema,
  updateFavoriteSchema,
  registrationSchema,
  loginSchema,
};

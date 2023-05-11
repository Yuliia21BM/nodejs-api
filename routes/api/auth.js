const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { registrationSchema, loginSchema } = require("../../schemas");
const {
  register,
  login,
  logout,
  getCurrent,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(registrationSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

module.exports = router;

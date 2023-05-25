const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  registrationSchema,
  loginSchema,
  validationEmailSchema,
} = require("../../schemas");
const {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(registrationSchema), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(validationEmailSchema), resendVerifyEmail);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrent);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const User = require("./../models/user");
const { HTTPError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HTTPError(409, "Email already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendEmail(email, verificationToken);

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
    subscription: newUser.subscription,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HTTPError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HTTPError(404, "User not found");
  }

  if (user.verify) {
    throw HTTPError(400, "Verification has already been passed");
  }

  await sendEmail(email, user.verificationToken);

  res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HTTPError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HTTPError(404, "User not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HTTPError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({ token });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};

const getCurrent = async (req, res) => {
  const { email, name, subscription } = req.user;

  res.json({
    email,
    name,
    subscription,
  });
};

const avatarDir = path.join(__dirname, "../", "public", "avatars");
const avatarExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "vebp"];

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const avatarName = `${_id}_${originalname}`;

  const fileExtension = originalname.substring(
    originalname.lastIndexOf(".") + 1
  );

  if (!avatarExtensions.includes(fileExtension.toLowerCase())) {
    throw HTTPError(
      400,
      `${originalname} includes an invalid file extension! Must be: ${avatarExtensions.join(
        ", or "
      )}`
    );
  }

  const resultUpload = path.join(avatarDir, avatarName);

  const image = await Jimp.read(tempUpload);
  await image.autocrop().cover(250, 250).quality(60).writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", avatarName); // перевірити точний шлях
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};

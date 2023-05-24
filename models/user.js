const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const usertSchema = new Schema(
  {
    name: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user minimum length 6"],
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

usertSchema.post("save", handleMongooseError);

const User = model("user", usertSchema);

module.exports = User;

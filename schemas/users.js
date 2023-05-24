const Joi = require("joi");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const registrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  token: Joi.string(),
});

const validationEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

module.exports = { registrationSchema, loginSchema, validationEmailSchema };

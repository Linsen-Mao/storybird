const Joi = require("joi");

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  profile: Joi.string().optional(),
  stories: Joi.array().optional(),
});

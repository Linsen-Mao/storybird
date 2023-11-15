const Joi = require("joi");

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(), // 例如最小長度為 6
  email: Joi.string().email().required(),
  profile: Joi.string().optional(),
  // 由於不需要對 stories, comments 和 likes 進行驗證，我們可以將它們設為可選
  stories: Joi.array().optional(),
  comments: Joi.array().optional(),
  likes: Joi.array().optional(),
});

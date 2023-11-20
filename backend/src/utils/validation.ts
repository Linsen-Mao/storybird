const Joi = require("joi");

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  profile: Joi.string().optional(),
});

export const storySchema = Joi.object({
  title: Joi.string().optional(),
  categoryId: Joi.number().integer().optional(),
  coverImage: Joi.string().optional(),
  description: Joi.string().optional(),
  creatorId: Joi.number().integer().optional(),
  writerId: Joi.number().integer().optional(),
});

export const storyImageSchema = Joi.object({
  storyId: Joi.number().integer().required(),
  imageFile: Joi.string().required(),
  caption: Joi.string().optional(),
  order: Joi.number().integer().optional(),
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

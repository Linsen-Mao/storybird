const Joi = require("joi");

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  profile: Joi.string().optional(),
  stories: Joi.array().items(Joi.number().integer()).optional(),
});

export const storySchema = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.number().integer().required(),
  coverImage: Joi.string().optional(),
  description: Joi.string().required(),
  authorId: Joi.number().integer().required(),
  images: Joi.array().items(Joi.number().integer()).optional(),
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

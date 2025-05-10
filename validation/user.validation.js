const Joi = require("joi");

const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  password: Joi.string().min(6).required(),
  photo: Joi.string().uri().optional(),
  user_info: Joi.string().allow(null, "").optional(),
  is_active: Joi.boolean().optional(),
  is_creator: Joi.boolean().optional(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(20),
  password: Joi.string().min(6),
  photo: Joi.string().uri(),
  user_info: Joi.string().allow(null, ""),
  is_active: Joi.boolean(),
  is_creator: Joi.boolean(),
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
};

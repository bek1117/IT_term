const Joi = require("joi");

const adminCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  password: Joi.string().min(6).required(),
  is_active: Joi.boolean().optional(),
  is_creator: Joi.boolean().optional(),
  activation_link : Joi.string().required()
});

const adminUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(20),
  password: Joi.string().min(6),
  is_active: Joi.boolean(),
  is_creator: Joi.boolean(),
});

module.exports = {
  adminCreateSchema,
  adminUpdateSchema,
};
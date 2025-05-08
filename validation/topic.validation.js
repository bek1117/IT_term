const Joi = require("joi");

module.exports = (body) => {
  const schema = Joi.object({
    author_id: Joi.string().required(),
    title: Joi.string().trim().required(),
    text: Joi.string().trim().allow(""),
    isChecked: Joi.boolean().default(false),
    isApproved: Joi.boolean().default(false),
    expert_id: Joi.string().allow(null, ""),
  });

  return schema.validate(body, { abortEarly: false });
};
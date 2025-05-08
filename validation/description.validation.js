const Joi = require("joi");

const descriptionValidation = (data) => {
  const schema = Joi.object({
    category_id: Joi.string().required(),
    description: Joi.string().trim().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = descriptionValidation;

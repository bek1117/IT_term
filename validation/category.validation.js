const Joi = require("joi");

const categoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = categoryValidation;

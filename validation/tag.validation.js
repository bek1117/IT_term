const joi = require("joi");
const { Types } = require("mongoose");

exports.tagValidation = (body) => {
  const schema = joi.object({
    topic_id: joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
        return value;
      }),
    category_id: joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
        return value;
      }),
  });

  return schema.validate(body, { abortEarly: false });
};

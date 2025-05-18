const Joi = require("joi");
const mongoose = require("mongoose");

const validateQA = (data) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    isChecked: Joi.boolean().optional().default(false),
    user_id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }),
    expert_id: Joi.string()
      .allow(null)
      .optional()
      .custom((value, helpers) => {
        if (value && !mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }),
  });

  return schema.validate(data);
};

module.exports = validateQA;
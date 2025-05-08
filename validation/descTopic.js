const Joi = require("joi");
const { Types } = require("mongoose");

const objectId = () =>
  Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
    return value;
  }, "ObjectId Validation");

const descTopicValidation = (data) => {
  const schema = Joi.object({
    desc_id: objectId().required(),
    dict_id: objectId().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = descTopicValidation;
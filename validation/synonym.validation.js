const Joi = require("joi");
const mongoose = require("mongoose");

exports.synonymValidation = (body) => {
  const objectId = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  };

  const schema = Joi.object({
    dict_id: Joi.string().custom(objectId, "ObjectId validation").required(),
    desc_id: Joi.string().custom(objectId, "ObjectId validation").required(),
  });

  return schema.validate(body, { abortEarly: false });
};
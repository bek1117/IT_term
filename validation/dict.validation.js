const joi = require("joi");

exports.dict_validation = (body) => {
  const scheme = joi.object({
    term: Joi.string()
      .required()
      .messages({
        "any.required": "Term is required",
        "string.empty": "Term cannot be empty",
      })
      .min(2)
      .message("Term should be at least 2 characters long"),
  });
  return scheme.validate(body);
};

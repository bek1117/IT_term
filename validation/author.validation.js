const joi = require("joi");

const authorFullName = (parent) => {
    return parent.first_name + " " + parent.last_name;
}

exports.authorValidation = (body) => {
  const scheme = joi.object({
    first_name: joi.string().trim().required(),
    last_name: joi.string().trim().required(),
    full_name: joi.string().trim().default(authorFullName),
    username: joi.string().trim().required(),
    email: joi.string().email().trim().required().lowercase(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: joi.ref("password"),
    phone: joi.string().trim().required(),
    info: joi.string().trim().allow(null, ""),
    position: joi.string().trim().required(),
    photo: joi.string().uri().trim().allow(null, ""),
    is_expert: joi.boolean().required(),
    is_active: joi.boolean().required(),
    gender : joi.string().trim().required().lowercase().valid("male", "female")
  });
  return scheme.validate(body, {abortEarly : false});
};
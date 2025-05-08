const Joi = require("joi");

exports.socialValidation = (body) => {
  const scheme = Joi.object(
    {
      name: Joi.string().required(),
      icon: Joi.string().required(),
    },
    { abortEarly: false }
  );
};

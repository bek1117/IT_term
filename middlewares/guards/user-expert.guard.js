const error_handler = require("../../utils/send.error.response");

module.exports = (req, res, next) => {
  try {
    if (!req.user.is_expert) {
      return res
        .status(403)
        .send({ messege: "Only experts can create new users" });
    }
    next();
  } catch (error) {
    error_handler(error, res);
  }
};
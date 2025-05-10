const error_handler = require("../../utils/send.error.response");

module.exports = (req, res, next) => {
  try {
    if (!req.author.is_expert) {
      return res
        .status(403)
        .send({ messege: "Only experts can add new dictionary" });
    }
    next();
  } catch (error) {
    error_handler(error, res);
  }
};
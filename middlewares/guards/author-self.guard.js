const error_handler = require("../../utils/send.error.response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id != req.author.id) {
      return res
        .status(403)
        .send({ messege: "You can only view your own info" });
    }
    next();
  } catch (error) {
    error_handler(error, res);
  }
};

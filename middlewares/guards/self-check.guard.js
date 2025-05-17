const error_handler = require("../../utils/send.error.response");

module.exports = (req, res, next) => {
  try {
    if (req.params.id != req.admin.id) {
      return res.status(403).send({ messege: "You are not allowed to do it!" });
    }
    next();
  } catch (error) {
    error_handler(error, res);
  }
};

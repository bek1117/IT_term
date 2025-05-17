const error_handler = require("../../utils/send.error.response");

module.exports = (users) => (req, res, next) => {
    try {
        if (!users.includes(req.user.role)) {
            return res.status(403).send({ message: "Access denied" });
        }
        next();
  } catch (error) {
    error_handler(error, res);
  }
};

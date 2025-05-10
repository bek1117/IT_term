const error_handler = require("../../utils/send.error.response");
const JWT = require("jsonwebtoken");
const config = require("config");
const key = config.get("JWTuser");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) {
      return res.status(401).send({ message: "Token is required" });
    }
    const [bearer, token] = authorization.split();
    const decoded = JWT.verify(token, key);
    if (bearer !== "Bearer") {
      return res.status(401).send({ message: "It's not bearer token" });
    }
    if (!decoded) {
      return res.status(401).send({ message: "Invalid token" });
    }
    if (!decoded.isExpert || !decoded.isActive) {
      return res.status(403).send({ message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    error_handler(error, res);
  }
};
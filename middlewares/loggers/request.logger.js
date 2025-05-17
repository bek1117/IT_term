const config = require("config");
require("winston-mongodb");
const winston = require("winston");
const expressWinston = require("express-winston");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const mongoTransport = new winston.transports.MongoDB({
  db: config.get("uri"),
  options: { useUnifiedTopology: true },
  collection: "ApiLogs",
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

module.exports = expressWinston.logger({
  transports: [consoleTransport, mongoTransport],
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

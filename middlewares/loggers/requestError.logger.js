const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const expressWinston = require("express-winston");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const dbTransport = new winston.transports.MongoDB({
  db: config.get("uri"),
  level: "error",
  collection: "errorLogs",
  format: winston.format.json(),
});

module.exports = expressWinston.errorLogger({
  transports: [consoleTransport, dbTransport],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});
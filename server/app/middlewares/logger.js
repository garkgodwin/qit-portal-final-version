const winston = require("winston");
const expressWinston = require("express-winston");

const httpLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...args } = info;

      const ts = timestamp.slice(0, 19).replace("T", " ");
      // console.log(`${ts} [${level}]: ${message}`);
      // console.log(args.meta);
      return `${ts} [${level}]: ${message} ${args.meta.res.statusCode}`;
    })
  ),
});

module.exports = {
  httpLogger,
};

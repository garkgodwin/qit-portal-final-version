const { env } = require("../constants/configs");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
  dbName:
    env === "DEV"
      ? "db-dev"
      : env === "TST"
      ? "db-tst"
      : env === "UAT"
      ? "db-uat"
      : env === "PROD"
      ? "db-prod"
      : "",
};

module.exports = options;

const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const historyController = require("../controllers/history.controller");
const generalController = require("../controllers/general.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/school-constants",
    [authJwt.verifyToken],
    generalController.schoolConstants
  );
  router.get(
    "/dashboard",
    [authJwt.verifyToken, check.SchoolHasCurrent],
    generalController.getDashboardData
  );
  router.get("/histories", [authJwt.verifyToken], historyController.histories);
  app.use("/api/v1/general", router);
};

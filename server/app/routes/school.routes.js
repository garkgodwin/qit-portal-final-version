const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/school.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllSchoolInfos
  );
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolAndSemUnique],
    controller.createSchoolInfo
  );
  router.put(
    "/:schoolID",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolAndSemUnique],
    controller.updateSchoolInfo
  );
  router.get(
    "/:schoolID",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSchoolInfoDetails
  );
  app.use("/api/v1/school", router);
};

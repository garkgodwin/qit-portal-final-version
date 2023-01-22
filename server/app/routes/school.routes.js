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
  router.get(
    "/current",
    [authJwt.verifyToken, check.SchoolHasCurrent],
    controller.getCurrent
  );
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createSchoolInfo
  );
  router.get(
    "/:schoolID/for-update",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSchoolInfoForUpdate
  );
  router.put(
    "/:schoolID/lock-unlock",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.lockUnlockSchoolInfo
  );
  router.put(
    "/:schoolID/move",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.moveSchoolInfo
  );
  router.put(
    "/:schoolID/for-update",
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

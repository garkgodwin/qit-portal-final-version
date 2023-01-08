const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/class.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolHasCurrent],
    controller.getAllClasses
  );
  router.post(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolHasCurrent],
    controller.createClass
  );
  router.put(
    "/:classID",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolHasCurrent],
    controller.updateClass
  );

  router.get(
    "/:classID",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolHasCurrent],
    controller.getClass
  );
  router.get(
    "/:classID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.getClass
  );
  router.get(
    "/:classID/students-available",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
      check.SchoolHasCurrent,
    ],
    controller.getStudentsAvailable
  );
  router.put(
    "/:classID/new-student/:studentID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.addStudentToClass
  );
  app.use("/api/v1/classes", router);
};

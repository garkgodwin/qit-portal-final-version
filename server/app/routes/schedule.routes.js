const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/schedule.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.getAllSchedules
  );

  router.get(
    "/:day/:time",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.getSchedulePerDayAndTime
  );
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.createSchedule
  );
  router.put(
    "/:scheduleID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.updateSchedule
  );

  router.get(
    "/:scheduleID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      check.SchoolHasCurrent,
    ],
    controller.getSchedule
  );
  app.use("/api/v1/schedules", router);
};

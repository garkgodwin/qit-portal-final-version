const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/staff.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllStaffs
  );
  router.get(
    "/instructors",
    [authJwt.verifyToken, authJwt.isAdmin, authJwt.isRegistrar],
    controller.getAllInstructors
  );
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.UsernameUnique,
      check.EmailUnique,
      check.MobileUnique,
      check.NameUnique,
    ],
    controller.createStaff
  );
  router.put(
    "/:personID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.UsernameUnique,
      check.EmailUnique,
      check.MobileUnique,
      check.NameUnique,
    ],
    controller.updateStaff
  );
  app.use("/api/v1/staffs", router);
};

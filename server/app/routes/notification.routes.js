const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/notification.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get("/unsent", controller.getUnsentSmsNotifications);
  router.post(
    "/grades",
    [authJwt.verifyToken, authJwt.isRegistrar, check.SchoolHasCurrent],
    controller.createGradeNotifications
  );
  app.use("/api/v1/notifications", router);
};

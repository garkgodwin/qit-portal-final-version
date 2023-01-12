const authJwt = require("../middlewares/authJWT");
const controller = require("../controllers/notification.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get("/unsent", controller.getUnsentSmsNotifications);
  app.use("/api/v1/notifications", router);
};

const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/user.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllAccounts
  );
  router.get("/:userID/for-setup", controller.getUserForSetup);
  router.put(
    "/:userID/for-setup",
    [check.UsernameUnique],
    controller.setFirstSetup
  );
  app.use("/api/v1/users", router);
};

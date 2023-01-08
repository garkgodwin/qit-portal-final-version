const authJwt = require("../middlewares/authJWT");
const controller = require("../controllers/auth.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get("/authenticate", [authJwt.verifyToken], controller.authenticate);
  router.post("/login", controller.login);
  router.post("/logout", controller.logout);
  app.use("/api/v1/auth", router);
};

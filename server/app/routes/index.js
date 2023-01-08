module.exports = (app) => {
  app.get("/api/v1", (req, res) => {
    res.send({ message: "Welcome to the API version 1.0" });
  });
  require("./auth.routes")(app);
  require("./general.routes")(app);
  require("./school.routes")(app);

  require("./user.routes")(app);
  require("./staff.routes")(app);
  require("./student.routes")(app);
  require("./class.routes")(app);
  require("./schedule.routes")(app);
};

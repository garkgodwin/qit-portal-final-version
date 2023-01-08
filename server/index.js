const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./app/middlewares/corsConfig");
const logger = require("./app/middlewares/logger");

//? MIDDLEWARES===============================================
app.use(cors(corsOptions));
app.use("/images", express.static("images"));
//app.use(logger.httpLogger); ----- USE THIS TO LOG THE API RESULT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger.httpLogger);

const models = require("./app/models");
const db = require("./app/db");
//? ROUTES====================================================
app.get("/", (req, res) => {
  res.json({ message: "QIT SERVER." });
});
require("./app/routes")(app);

//TODO: Add the websocket for express for handshake connection
//? START SERVER=================================================
const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}.`);
  //? DATABASE CONNECTION======================================
  db.connect(models.mongoose);
});

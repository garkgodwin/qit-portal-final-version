const { ATLAS_URI } = require("../constants/configs.js");
const options = require("./options");

const connect = (mongoose) => {
  console.log("Connecting to the mongoose database.");
  mongoose.set("strictQuery", false);
  mongoose
    .connect(ATLAS_URI, options)
    .then((data) => {
      const dbName = data.mongoose.connections[0].name;
      console.log("Server connected with the database: " + dbName);
      require("../seed").startSeed();
      //? once connected start email notifcations
      require("../controllers/notification.controller").getAndSendEmailNotifications();
      require("../controllers/notification.controller").createAndSendNotifications7days();
    })
    .catch((error) => {
      console.log(
        "Server encountered an error while connecting to the database: ",
        error
      );
      process.exit(1);
    });
};

module.exports = { connect };

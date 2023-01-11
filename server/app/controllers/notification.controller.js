const db = require("../models");
const NotificationModel = db.notifications;

exports.getUnsentSmsNotifications = async (req, res) => {
  const data = await NotificationModel.find({
    smsSent: false,
  }).exec();

  //TODO: Check date to send also
  return res.status(200).send({
    message: "Successfully retrieved all unsent notifications.",
    notifications: data,
  });
};

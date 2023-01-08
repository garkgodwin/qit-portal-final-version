const db = require("../models");
const HistoryModel = db.histories;

exports.createHistory = async (text, isAuto, user) => {
  const history = HistoryModel({
    text: text,
    isAuto: isAuto,
    user: user,
  });
  await history.save();
};

exports.histories = async (req, res) => {
  const histories = await HistoryModel.find({}).exec();
  return res.status(200).send({
    message: "Successful",
    data: histories,
  });
};

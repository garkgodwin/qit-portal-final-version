const db = require("../models");
const PersonModel = db.persons;
const UserModel = db.users;
const NotificationModel = db.notifications;
const { createHistory } = require("./history.controller");
const { generateOtp } = require("../helpers/generate");

exports.getAllStaffs = async (req, res) => {
  const all = await PersonModel.find({})
    .populate({
      path: "user",
    })
    .exec();
  const staffs = all.filter((per) => {
    return per.user.role === 1 || per.user.role === 2 || per.user.role === 3;
  });
  return res.status(200).send({
    message: "Successfully fetched all staffs",
    data: staffs,
  });
};
exports.getAllInstructors = async (req, res) => {
  const all = await PersonModel.find({})
    .populate({
      path: "user",
    })
    .exec();
  const instructors = all.filter((per) => {
    return per.user.role === 3;
  });
  return res.status(200).send({
    message: "Successfully fetched all instructors",
    data: instructors,
  });
};

exports.createStaff = async (req, res) => {
  const body = req.body;
  const person = body.person;
  const user = body.user;
  const newUser = UserModel(user);
  const newPerson = PersonModel(person);
  newUser.person = newPerson._id;
  newUser.otp = generateOtp();
  newPerson.user = newUser._id;
  await newUser.save();
  await newPerson.save();
  await createHistory("created a new staff", false, req.userId);
  const newNotif = NotificationModel({
    subject: "QIT Portal",
    body: `Please don't share your new OTP: ${newUser.otp}`,
    mobileNumber: newPerson.mobileNumber,
    email: newUser.email,
    shootDate: "Today",
  });
  await newNotif.save();

  const createdPerson = await PersonModel.findById(newPerson._id)
    .populate({
      path: "user",
    })
    .exec();

  return res.status(200).send({
    message: "Successfully created a staff",
    data: createdPerson,
  });
};
//? updates person details only
exports.updateStaff = async (req, res) => {
  const body = req.body;
  const person = body.person;
};

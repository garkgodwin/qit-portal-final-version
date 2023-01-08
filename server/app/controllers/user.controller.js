const db = require("../models");
const UserModel = db.users;
const generate = require("../helpers/generate");
exports.getAllAccounts = async (req, res) => {
  const accounts = await UserModel.find({})
    .populate({
      path: "person",
    })
    .exec();

  return res.status(200).send({
    message: "Successfully fetched the accounts",
    data: accounts,
  });
};

exports.getUserForSetup = async (req, res) => {
  const id = req.params.userID;
  if (!id) {
    return res.status(404).send({
      message: "User id is missing",
    });
  }
  const user = await UserModel.findById(id)
    .populate({
      path: "person",
    })
    .exec();
  if (!user) {
    return res.status(404).send({
      message: "User does not exist",
    });
  }

  if (user.activated) {
    return res.status(409).send({
      message: "User has already been activated",
    });
  }

  return res.status(200).send({
    message: "Successfully fetched user for first setup",
    data: user,
  });
};

exports.setFirstSetup = async (req, res) => {
  const id = req.params.userID;
  const body = req.body;
  const user = body.user;
  if (user.password === "" || user.confirmPassword === "" || user.otp === "") {
    return res.status(409).send({
      message: "Please complete all the fields",
    });
  }

  let userUpdate = await UserModel.findById(id);
  if (userUpdate.otp !== user.otp) {
    return res.status(409).send({
      message: "The otp is invalid",
    });
  }
  if (userUpdate.activated) {
    return res.status(409).send({
      message: "The user has already been activated.",
    });
  }
  userUpdate.username = user.username;
  userUpdate.password = generate.generateHashedPassword(user.password);
  userUpdate.otp = null;
  userUpdate.activated = true;
  await userUpdate.save();

  return res.status(200).send({
    message: "Your account is now activated, proceed to login",
  });
};

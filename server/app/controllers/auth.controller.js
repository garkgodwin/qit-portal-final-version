const { SECRET_KEY } = require("../constants/configs");
const db = require("../models");
const User = db.users;
const PersonModel = db.persons;

const { createHistory } = require("./history.controller");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.authenticate = async (req, res) => {
  const userId = req.userId;
  let user = await User.findOne({
    _id: userId,
  })
    .populate({
      path: "person",
    })
    .exec();
  if (!user) {
    return res.status(401).send({
      message: "Credentials are invalid. Please login again.",
    });
  }
  await createHistory(`authenticating token`, false, userId);
  return res.status(200).send({
    message: "Credentials are valid.",
    data: {
      user: user,
    },
  });
};

exports.login = async (req, res) => {
  const b = req.body;
  let user = await User.findOne({
    username: b.username,
  })
    .populate({
      path: "person",
    })
    .exec();
  if (!user) {
    return res.status(401).send({ message: "Login failed" });
  }

  if (!user.activated) {
    return res.status(200).send({
      message: "Enter OTP and password to activate your account",
      data: {
        user: user,
        type: "first-setup",
      },
    });
  }

  const passwordIsValid = bcrypt.compareSync(b.password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({
      message: "Invalid credentials, please try again",
    });
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: 86400, // 24hours
  });

  await createHistory(`logged in`, false, user._id);

  return res.status(200).send({
    data: {
      type: "login",
      user: user,
      token: token,
    },
    message: "Your credentials are valid",
  });
};

exports.logout = async (req, res, next) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out" });
  } catch (error) {
    next(error);
  }
};

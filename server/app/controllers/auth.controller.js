const { SECRET_KEY } = require("../constants/configs");
const db = require("../models");
const User = db.users;
const PersonModel = db.persons;
const StudentModel = db.students;

const { createHistory } = require("./history.controller");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.authenticate = async (req, res) => {
  const userId = req.userId;
  if (!userId || userId === "") {
    return res.status(404).send({
      message: "User is not found",
    });
  }
  let user = await User.findById(userId)
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
  if (user.role === 4 || user.role === 5) {
    const student = await StudentModel.findOne({
      user: user._id,
    }).exec();
    return res.status(200).send({
      message: "Credentials are valid",
      data: {
        user: user,
        student: student,
      },
    });
  } else {
    return res.status(200).send({
      message: "Credentials are valid.",
      data: {
        user: user,
      },
    });
  }
};

exports.login = async (req, res) => {
  const b = req.body;

  if (!b.username || b.username === "") {
    return res.status(409).send({
      message: "Please enter your username",
    });
  }
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

  if (!b.password || b.password === "") {
    return res.status(409).send({
      message: "Please enter your password",
    });
  }
  if (!user.password) {
    return res.status(500).send({
      message: "Something went wrong",
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

  if (user.role === 4 || user.role === 5) {
    const student = await StudentModel.findOne({
      user: user._id,
    }).exec();
    return res.status(200).send({
      data: {
        type: "login",
        user: user,
        student: student,
        token: token,
      },
      message: "Your credentials are valid",
    });
  } else {
    return res.status(200).send({
      data: {
        type: "login",
        user: user,
        token: token,
      },
      message: "Your credentials are valid",
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out" });
  } catch (error) {
    next(error);
  }
};

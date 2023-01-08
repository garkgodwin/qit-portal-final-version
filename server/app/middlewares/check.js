const db = require("../models");
const PersonModel = db.persons;
const UserModel = db.users;
const StudentSubjectModel = db.studentSubjects;
const SchoolInfoModel = db.schoolInfo;
exports.NameUnique = async (req, res, next) => {
  const person = req.body.person;
  const personID = req.params.personID;
  const name = person.name;

  if (!name || name === "") {
    return res.status(404).send({
      message: "Please fill in the name field.",
    });
  }
  let filter = {
    name: name,
  };
  if (personID) {
    filter = {
      ...filter,
      _id: {
        $ne: personID,
      },
    };
  }
  const nameExists = await PersonModel.findOne(filter).exec();
  if (nameExists) {
    return res.status(409).send({
      message: `The name: ${name} has already been used`,
    });
  }
  return next();
};
exports.MobileUnique = async (req, res, next) => {
  const person = req.body.person;
  const personID = req.params.personID;
  const mobileNumber = person.mobileNumber;
  return next();
  if (!mobileNumber || mobileNumber === "") {
    return res.status(404).send({
      message: "Please fill in the email field.",
    });
  }
  let filter = {
    mobileNumber: mobileNumber,
  };
  if (personID) {
    filter = {
      ...filter,
      _id: {
        $ne: personID,
      },
    };
  }
  const mobileExists = await PersonModel.findOne(filter).exec();
  if (mobileExists) {
    return res.status(409).send({
      message: `The mobile number: ${mobileNumber} has already been used`,
    });
  }
  return next();
};

exports.UsernameUnique = async (req, res, next) => {
  const user = req.body.user;
  const userID = req.params.userID;
  const username = user.username;
  if (!username || username === "") {
    return res.status(404).send({
      message: "Please fill in the username field.",
    });
  }
  let filter = {
    username: username,
  };
  if (userID) {
    filter = {
      ...filter,
      _id: { $ne: userID },
    };
  }
  const usernameExists = await UserModel.findOne(filter).exec();
  if (usernameExists) {
    return res.status(409).send({
      message: `The username: ${username} has already been used`,
    });
  }
  return next();
};
exports.EmailUnique = async (req, res, next) => {
  const user = req.body.user;
  const userID = req.params.userID;
  const email = user.email;
  if (!email || email === "") {
    return res.status(404).send({
      message: "Please fill in the email field.",
    });
  }
  let filter = {
    email: email,
  };
  if (userID) {
    filter = {
      ...filter,
      _id: userID,
    };
  }
  const emailExists = await UserModel.findOne(filter).exec();
  if (emailExists) {
    return res.status(409).send({
      message: `The email: ${email} has already been used`,
    });
  }
  return next();
};
exports.StudentSubjectUnique = async (req, res, next) => {
  const studentID = req.params.studentID;
  const subject = req.body.subject;
  const subjectCode = subject.subjectCode;

  const filter = {
    student: studentID,
    subjectCode: subjectCode,
  };
  const subjectExists = await StudentSubjectModel.findOne(filter)
    .populate({
      path: "student",
      populate: {
        path: "person",
      },
    })
    .exec();
  if (subjectExists) {
    return res.status(409).send({
      message: `The subject: ${subjectCode} for student: ${subjectExists.student.person.name} has already been used`,
    });
  }
  return next();
};

exports.SchoolHasCurrent = async (req, res, next) => {
  const schoolCurrent = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();
  if (!schoolCurrent) {
    return res.status(404).send({
      message: "Cannot proceed, school has no current school year and semester",
    });
  }
  req.currentSchoolID = schoolCurrent._id;
  return next();
};
exports.SchoolAndSemUnique = async (req, res, next) => {
  const info = req.body.schoolInfo;
  const schoolID = req.params.schoolID;
  let filter = {
    sy: info.sy,
    sem: info.sem,
  };
  if (schoolID) {
    filter = {
      ...filter,
      _id: schoolID,
    };
  }
  const semSyExists = await SchoolInfoModel.findOne(filter).exec();
  if (semSyExists) {
    return res.status(409).send({
      message: `The school year: ${info.sy} and semester: ${info.sem} has already been created.`,
    });
  }
  return next();
};

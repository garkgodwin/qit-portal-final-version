const db = require("../models");
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
const ClassModel = db.class;
const { createHistory } = require("./history.controller");
exports.getAllSchoolInfos = async (req, res) => {
  const infos = await SchoolInfoModel.find({}).exec();
  return res.status(200).send({
    message: "Successful",
    data: infos,
  });
};

exports.getSchoolInfoDetails = async (req, res) => {
  const schoolID = req.params.schoolID;
  if (!schoolID) {
    return res.status(404).send({
      message: "Please select a school information",
    });
  }
  const students = await StudentModel.find({
    schoolInfo: schoolID,
  })
    .populate({
      path: "person",
    })
    .exec();
  const classes = await ClassModel.find({
    schoolInfo: schoolID,
  }).populate({
    path: "instructor",
    populate: {
      path: "person",
    },
  });
  return res.status(200).send({
    message: "Successful",
    data: {
      students: students,
      classes: classes,
    },
  });
};

exports.createSchoolInfo = async (req, res) => {
  const body = req.body;
  const info = body.schoolInfo;
  const newInfo = SchoolInfoModel({
    sy: info.sy,
    sem: info.sem,
    startDate: info.startDate,
    endDate: info.endDate,
  });
  await newInfo.save();
  await createHistory(
    `create school info for school year: ${info.sy} and semester: ${info.sem}`,
    false,
    req.userId
  );
  return res.status(200).send({
    message: "Successfully created a school info",
    data: newInfo,
  });
};

exports.updateSchoolInfo = async (req, res) => {
  //? cannot update school year and semester
  const body = req.body;
  const info = body.schoolInfo;
  const schoolID = req.params.schoolID;
  const schoolInfo = await SchoolInfoModel.findById(schoolID).exec();
  schoolInfo.startDate = info.startDate;
  schoolInfo.endDate = info.endDate;
  await schoolInfo.save();
  await createHistory(
    `update school info for school year: ${info.sy} and semester: ${info.sem}`,
    false,
    req.userId
  );
  return res.status(200).send({
    message: "Successfully created a school info",
    data: schoolInfo,
  });
};

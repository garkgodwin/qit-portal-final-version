const db = require("../models");
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
const ClassModel = db.class;
const { createHistory } = require("./history.controller");
exports.getAllSchoolInfos = async (req, res) => {
  const infos = await SchoolInfoModel.find({}).lean();
  let newInfos = [];
  for (let i = 0; i < infos.length; i++) {
    let info = infos[i];
    const sc = await StudentModel.find({
      schoolInfo: info._id,
    }).count();
    const cc = await ClassModel.find({
      schoolInfo: info._id,
    }).count();
    info.numberOfStudents = sc;
    info.numberOfClasses = cc;
    newInfos.push(info);
  }
  return res.status(200).send({
    message: "Successful",
    data: newInfos,
  });
};
exports.getCurrent = async (req, res) => {
  const id = req.currentSchoolID;
  const current = await SchoolInfoModel.findById(id);
  return res.status(200).send({
    message: "Successfully retrieved the current school data",
    data: current,
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
exports.getSchoolInfoForUpdate = async (req, res) => {
  const schoolID = req.params.schoolID;
  if (!schoolID) {
    return res.status(404).send({
      message: "Please select a school information",
    });
  }
  const school = await SchoolInfoModel.findById(schoolID).exec();
  return res.status(200).send({
    message: "Successful",
    data: school,
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
  await require("./notification.controller").createAndSendNotifications7days(
    "update"
  );
  return res.status(200).send({
    message: "Successfully update the current school info",
    data: schoolInfo,
  });
};

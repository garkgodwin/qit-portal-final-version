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
  await updateNotifications();
  return res.status(200).send({
    message: "Successfully update the current school info",
    data: schoolInfo,
  });
};

const updateNotifications = async () => {
  const school = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();
  let shootDate = new Date(Date.parse(school.endDate));
  shootDate = new Date(shootDate.setDate(shootDate.getDate() - 8))
    .toISOString()
    .substring(0, 10);

  const students = await StudentModel.find({
    schoolInfo: school._id,
  })
    .populate({
      path: "guardian",
      populate: {
        path: "person",
      },
    })
    .populate({
      path: "person",
    })
    .populate({
      path: "user",
    })
    .exec();

  //? map students
  for (let i = 0; i < students.length; i++) {
    //? get guardians
    let student = students[i];
    let studentUser = student.user;
    let studentPerson = student.person;
    let guardianUser = student.guardian;

    if (!studentUser.semesterNotification) {
      let message = "";
      if (totalStudentGrade < 55) {
        message = `We are very sorry to inform you that your grade ${totalStudentGrade} is currently below the passing grade.`;
      } else {
        message = `Congratulations! Your grade is ${totalStudentGrade}!`;
      }
      const newNotifStudent = NotificationModel({
        subject: "QIT Portal",
        body: `Good day ${student.person.name}! ${message}`,
        mobileNumber: studentPerson.mobileNumber,
        smsSent: false,
        email: studentUser.email,
        emailSent: false,
        shootDate: shootDate,
      });
      studentUser.semesterNotification = newNotifStudent._id;
      await newNotifStudent.save();
      await studentUser.save();
    }
    //? GUARDIAN NOTIF
    if (guardianUser && !guardianUser.semesterNotification) {
      let message = "";
      if (totalStudentGrade < 55) {
        message = `We are very sorry to inform you that your student's grade ${totalStudentGrade} is currently below the passing grade.`;
      } else {
        message = `Congratulations! Your student's grade is ${totalStudentGrade}!`;
      }
      const newNotif = NotificationModel({
        subject: "QIT Portal",
        body: `Good day ${guardianUser.person.name}! ${message}`,
        mobileNumber: guardianUser.mobileNumber,
        smsSent: false,
        email: guardianUser.person.email,
        emailSent: false,
        shootDate: shootDate,
      });
      guardianUser.semesterNotification = newNotif._id;
      await newNotif.save();
      await guardianUser.save();
    }

    if (studentUser.semesterNotification) {
      let message = "";
      if (totalStudentGrade < 55) {
        message = `We are very sorry to inform you that your grade ${totalStudentGrade} is currently below the passing grade.`;
      } else {
        message = `Congratulations! Your grade is ${totalStudentGrade}!`;
      }
      let updateNotif = await NotificationModel.findById(
        studentUser.semesterNotification
      );
      updateNotif.shootDate = shootDate;
      updateNotif.body = `Good day ${student.person.name}! ${message}`;
      updateNotif.subject = "QIT Portal";
      await updateNotif.save();
    }
    //? GUARDIAN NOTIF
    if (guardianUser && guardianUser.semesterNotification) {
      let message = "";
      if (totalStudentGrade < 55) {
        message = `We are very sorry to inform you that your student's grade ${totalStudentGrade} is currently below the passing grade.`;
      } else {
        message = `Congratulations! Your student's grade is ${totalStudentGrade}!`;
      }
      let updateNotif = await NotificationModel.findById(
        studentUser.semesterNotification
      );
      updateNotif.shootDate = shootDate;
      updateNotif.body = `Good day ${guardianUser.person.name}! ${message}`;
      updateNotif.subject = "QIT Portal";
      await updateNotif.save();
    }
  }
};

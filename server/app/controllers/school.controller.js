const db = require("../models");
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
const StudentSubjectModel = db.studentSubjects;
const NotificationModel = db.notifications;
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

const generateNewRecordFromLatest = (info) => {
  if (!info) {
    return null;
  }
  const sem = info.sem;
  if (sem === 1) {
    return {
      newSem: 2,
      newSy: info.sy,
    };
  } else {
    const sys = info.sy.split("-");
    const syStart = parseInt(sys[1]) + 1;
    const syEnd = syStart + 1;
    return {
      newSem: 1,
      newSy: syStart.toString() + "-" + syEnd.toString(),
    };
  }
};

exports.createSchoolInfo = async (req, res) => {
  const latest = await SchoolInfoModel.findOne()
    .sort({
      createdAt: -1,
    })
    .exec();
  const newRecord = generateNewRecordFromLatest(latest);
  if (!newRecord) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
  const newInfo = SchoolInfoModel({
    sy: newRecord.newSy,
    sem: newRecord.newSem,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
  });
  await newInfo.save();
  await createHistory(
    `create school info for school year: ${newInfo.sy} and semester: ${newInfo.sem}`,
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
    message: "Successfully update the current school info",
    data: schoolInfo,
  });
};

exports.lockUnlockSchoolInfo = async (req, res) => {
  const id = req.params.schoolID;
  let info = await SchoolInfoModel.findById(id).exec();
  if (!info) {
    return res.status(404).send({
      message: "School info is not found",
    });
  }
  info.locked = !info.locked;
  await info.save();
  return res.status(200).send({
    message: `School info is now ${info.locked ? "locked" : "unlocked"}.`,
    data: info,
  });
};

exports.moveSchoolInfo = async (req, res) => {
  const id = req.params.schoolID;
  if (!id) {
    return res.status(404).send({
      message: "School info is not found",
    });
  }
  let infoToBeMoved = await SchoolInfoModel.findById(id).exec();
  if (!infoToBeMoved) {
    return res.status(404).send({
      message: "School info is not found",
    });
  }

  //? check if current is not locked
  let findCurrent = await SchoolInfoModel.findOne({
    current: true,
  });
  if (!findCurrent.locked) {
    return res.status(409).send({
      message:
        "You need to lock the current school information before moving to the desired info.",
    });
  }

  //? update current
  //? update to be moved
  findCurrent.current = false;
  await findCurrent.save();
  infoToBeMoved.current = true;
  infoToBeMoved.locked = false;
  await infoToBeMoved.save();

  //? UPDATE STUDENT SUBJECTS TO COMPLETE OR DROPPED
  await StudentSubjectModel.updateMany(
    {
      schoolInfo: findCurrent._id,
      status: 0,
    },
    {
      status: 2,
    }
  ).exec();

  return res.status(200).send({
    message: "Successfully moved to another school year and semester",
    data: infoToBeMoved,
  });
};
const updateNotifications = async () => {
  console.log("Updating notifications");
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
    console.log("updating student notif");
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

    const totalStudentGrade = await getStudentCurrentGrade(student._id);
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

const getStudentCurrentGrade = async (student, currentSchoolID) => {
  const subjects = await StudentSubjectModel.find({
    student: student._id,
    schoolInfo: currentSchoolID,
  });
  let courseSubjects = [];
  if (student.type === 1) {
    courseSubjects = collegeSubjectsToArray(COLLEGE_SUBJECTS);
  } else if (student.type === 2) {
    courseSubjects = seniorSubjectsToArray(SENIOR_SUBJECTS);
  } else if (student.type === 3) {
    courseSubjects = juniorSubjectsToArray(JUNIOR_SUBJECTS);
  } else {
    return 0;
  }

  if (subjects.length > 0) {
    let totalUnits = 0;
    let totalGrades = 0;
    for (let i = 0; i < subjects.length; i++) {
      const sub = subjects[i];
      let subDetails = courseSubjects.find((a) => {
        return a.code === sub.code;
      });
      if (subDetails.type !== "extra") {
        const prelimGrade = calculateTermGrade(sub.grades.prelim) * 0.2;
        const midGrade = calculateTermGrade(sub.grades.mid) * 0.2;
        const prefiGrade = calculateTermGrade(sub.grades.prefi) * 0.2;
        const finalGrade = calculateTermGrade(sub.grades.final) * 0.4;
        const subTotal =
          (prelimGrade + midGrade + prefiGrade + finalGrade) *
          100 *
          subDetails.units;
        totalGrades += subTotal;
        totalUnits += subDetails.units;
      }
    }
    console.log(total);
    const total = (totalGrades / totalUnits).toFixed(2);
    return total;
  } else {
    return 0;
  }
};

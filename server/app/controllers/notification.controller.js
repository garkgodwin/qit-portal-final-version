const db = require("../models");
const NotificationModel = db.notifications;
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
const StudentSubjectModel = db.studentSubjects;
const {
  COLLEGE_SUBJECTS,
  SENIOR_SUBJECTS,
  JUNIOR_SUBJECTS,
} = require("../constants/school");
const {
  collegeSubjectsToArray,
  seniorSubjectsToArray,
  juniorSubjectsToArray,
} = require("../helpers/get");
const { calculateTermGrade } = require("../helpers/calculate");
const nodemailer = require("nodemailer");

exports.getUnsentSmsNotifications = async (req, res) => {
  const data = await NotificationModel.find({
    smsSent: false,
    shootDate: "", //TODO
  }).exec();

  for (let i = 0; i < data.length; i++) {
    await NotificationModel.findByIdAndUpdate(data[i]._id, {
      smsSent: true,
    }).exec();
  }

  //TODO: Check date to send also
  return res.status(200).send({
    message: "Successfully retrieved all unsent sms notifications.",
    notifications: data,
  });
};

exports.getAndSendEmailNotifications = async () => {
  console.log("Fetching unset email notifications");

  const sender = "qitportal@gmail.com";
  const senderPass = "fdudcmidwfiirsgg";
  setInterval(async () => {
    const data = await NotificationModel.find({
      emailSent: false,
    }).exec();
    for (let i = 0; i < data.length; i++) {
      const notif = data[i];
      if (isDateLessThanToday(notif.shootDate)) {
        console.log("Sending email notification to: " + notif.email);
        sendEmail(sender, senderPass, notif);
        await NotificationModel.findByIdAndUpdate(notif._id, {
          emailSent: true,
        });
      }
    }
    if (data.length > 0) {
      console.log("Sent all unsent notifications");
    }
  }, 10000);
};

exports.createAndSendNotifications7days = async () => {
  const school = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();
  let shootDate = new Date(Date.parse(school.endDate));
  shootDate = new Date(shootDate.setDate(shootDate.getDate() - 8))
    .toISOString()
    .substring(0, 10);
  setInterval(async () => {
    console.log("Create notif based on school info endDate");
    //? find all students and their guardians
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
      const totalStudentGrade = await getStudentCurrentGrade(student._id);
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

      // if (studentUser.semesterNotification) {
      //   //? get notification semester
      //   let oldNotif = await NotificationModel.findById(
      //     studentUser.semesterNotification
      //   ).exec();
      //   if (isDateLessThanToday(oldNotif.shootDate)) {
      //     console.log("Sending email notification to: " + oldNotif.email);
      //     sendEmail(sender, senderPass, oldNotif);
      //     await NotificationModel.findByIdAndUpdate(notif._id, {
      //       emailSent: true,
      //     });
      //   }
      // }
      // if (guardianUser && guardianUser.semesterNotification) {
      //   let oldNotif = await NotificationModel.findById(
      //     guardianUser.semesterNotification
      //   ).exec();
      //   if (isDateLessThanToday(oldNotif.shootDate)) {
      //     console.log("Sending email notification to: " + oldNotif.email);
      //     sendEmail(sender, senderPass, oldNotif);
      //     await NotificationModel.findByIdAndUpdate(notif._id, {
      //       emailSent: true,
      //     });
      //   }
      // }
    }
  }, 20000);
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

const isDateLessThanToday = (dateStr) => {
  const today = new Date().toISOString().substring(0, 10);
  if (dateStr === today) {
    return true;
  }
  return false;
};

const sendEmail = async (sender, senderPass, notification) => {
  let flag = false;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 587,
    auth: {
      user: sender,
      pass: senderPass,
    },
  });
  var mailOptions = {
    from: sender,
    to: notification.email,
    subject: notification.subject,
    text: notification.body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      flag = false;
    } else {
      console.log("Email sent: " + info.response);
      flag = true;
    }
  });
};

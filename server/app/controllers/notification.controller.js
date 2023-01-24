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
  getSemTotalGrade,
  getTermGrade,
  getSubjectTotalGrade,
} = require("../helpers/get");
const nodemailer = require("nodemailer");

exports.createGradeNotifications = async (req, res) => {
  const currentSchoolID = req.currentSchoolID;
  const body = req.body;
  const type = parseInt(body.data.type); // 1 - prelim , 2 - midterm, 3 - prefinal, 4 - final, 5 - all grades
  //? get students
  const students = await StudentModel.find({
    schoolInfo: currentSchoolID,
  })
    .populate({
      path: "person",
    })
    .populate({
      path: "user",
    });

  const mainSubject = "QIT Portal";
  let subjectMessage =
    type === 1
      ? "Preliminary Term"
      : type === 2
      ? "Middle Term"
      : type === 3
      ? "Pre-final Term"
      : type === 4
      ? "Final Term"
      : type === 5
      ? "Semester"
      : "Grade";
  const textTitle = mainSubject + " : " + subjectMessage;

  //? get subject of each student and get total grade
  //? use the helper get
  let shootDate = new Date().toISOString().substring(0, 10);
  for (let i = 0; i < students.length; i++) {
    let message = "";
    const student = students[i];
    const gender = student.person.gender === 1 ? "Mr. " : "Ms.";
    const name = student.person.name;
    const subjects = await StudentSubjectModel.find({
      student: student._id,
      schoolInfo: currentSchoolID,
    }).exec();
    if (subjects.length === 0) {
      message = `${gender}${student.person.name}, you have no subjects enrolled for this school year and semester`;
      const newNotif = NotificationModel({
        subject: textTitle,
        body: message,
        mobileNumber: student.person.mobileNumber,
        email: student.user.email,
        smsSent: false,
        emailSent: false,
        shootDate: shootDate,
      });
      await newNotif.save();
    } else {
      if (type === 5) {
        for (let x = 0; x < subjects.length; x++) {
          const subject = subjects[x];
          const subjectTotalGrade = getSubjectTotalGrade(subject);
          message =
            `${gender}${student.person.name}, ` +
            (subjectTotalGrade < 50
              ? `we are very sorry to inform you that you have failed for the subject ${subject.subjectName} with the grade of ${subjectTotalGrade}`
              : `congratulations! You passed the subject ${subject.subjectName} with the grade of ${subjectTotalGrade}`);

          const newNotif = NotificationModel({
            subject: textTitle,
            body: message,
            mobileNumber: student.person.mobileNumber,
            email: student.user.email,
            smsSent: false,
            emailSent: false,
            shootDate: shootDate,
          });
          await newNotif.save();
        }
        const grade = getSemTotalGrade(subjects);
        console.log(grade);
        const isCongrats =
          grade.point <= 3
            ? `${gender}${student.person.name}, congratulations! You passed for this school year and semester. Your grade is ${grade.total} with the equivalent GWA: ${grade.point}`
            : `${gender}${student.person.name}, we are very sorry to inform you that you failed for this school year and semester. Your grade is ${grade.total} with the equivalent GWA: ${grade.point}`;
        message = isCongrats;

        const newNotif = NotificationModel({
          subject: textTitle,
          body: message,
          mobileNumber: student.person.mobileNumber,
          email: student.user.email,
          smsSent: false,
          emailSent: false,
          shootDate: shootDate,
        });
        await newNotif.save();
      } else if (type !== 5) {
        for (let x = 0; x < subjects.length; x++) {
          const subject = subjects[x];
          const grades = subject.grades;
          const prelim = grades.prelim;
          const mid = grades.mid;
          const prefi = grades.prefi;
          const final = grades.final;
          const termGrade =
            type === 1
              ? prelim
              : type === 2
              ? mid
              : type === 3
              ? prefi
              : type === 4
              ? final
              : 0;
          message =
            `${gender}${student.person.name}, ` +
            (termGrade < 50
              ? `we are very sorry to inform you that you have failed for the subject ${subject.subjectName} with the grade of ${termGrade}`
              : `congratulations! You passed the subject ${subject.subjectName} with the grade of ${termGrade}`);

          const newNotif = NotificationModel({
            subject: textTitle,
            body: message,
            mobileNumber: student.person.mobileNumber,
            email: student.user.email,
            smsSent: false,
            emailSent: false,
            shootDate: shootDate,
          });
          await newNotif.save();
        }
      }
    }
  }

  return res.status(200).send({
    message:
      "Successfully created the notifications, sending grades to students now",
  });
};

exports.getUnsentSmsNotifications = async (req, res) => {
  console.log("Fetch unsent SMS notifications");
  const data = await NotificationModel.find({
    smsSent: false,
  }).exec();

  const formattedNotifications = [];
  for (let i = 0; i < data.length; i++) {
    let notif = data[i];
    if (isDateLessThanToday(notif.shootDate)) {
      console.log("Sending sms notification to: " + notif.mobileNumber);
      let fNotif = notif;
      fNotif.sent = notif.smsSent;
      formattedNotifications.push(fNotif);
      await NotificationModel.findByIdAndUpdate(data[i]._id, {
        smsSent: true,
      }).exec();
    }
  }

  //TODO: Check date to send also
  return res.status(200).send({
    message: "Successfully retrieved all unsent sms notifications.",
    notifications: formattedNotifications,
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
        if (sendEmail(sender, senderPass, notif)) {
          await NotificationModel.findByIdAndUpdate(notif._id, {
            emailSent: true,
          });
        }
      }
    }
    if (data.length > 0) {
      console.log("No more email notifications to be sent");
    }
  }, 10000);
};

exports.createAndSendNotifications7days = async (actionType) => {
  console.log("Create notif based on school info endDate");
  const school = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();
  let type = actionType ? actionType : "create";
  let shootDate = new Date(Date.parse(school.endDate));
  shootDate = new Date(shootDate.setDate(shootDate.getDate() - 8))
    .toISOString()
    .substring(0, 10);
  setInterval(async () => {
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
      if (type === "create") {
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
  }, 60000);
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
        const prelimGrade =
          sub.grades && sub.grades.prelim ? sub.grades.prelim : 0 * 0.2;
        const midGrade =
          sub.grades && sub.grades.prelim ? sub.grades.prelim : 0 * 0.2;
        const prefiGrade =
          sub.grades && sub.grades.prelim ? sub.grades.prelim : 0 * 0.2;
        const finalGrade =
          sub.grades && sub.grades.prelim ? sub.grades.prelim : 0 * 0.2;
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
  const shootDate = new Date(dateStr);
  const today = new Date();
  if (shootDate <= today) {
    return true;
  }
  return false;
};

var transporter = nodemailer.createTransport({
  host: "gmail",
  auth: {
    user: "qitportal@gmail.com",
    pass: "**Qwerty123**",
  },
});

const sendEmail = async (sender, senderPass, notification) => {
  let flag = false;
  var mailOptions = {
    from: sender,
    to: notification.email,
    subject: notification.subject,
    text: notification.body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      flag = false;
    } else {
      console.log("Email sent: " + info.response);
      flag = true;
    }
  });
  return flag;
};

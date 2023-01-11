const db = require("../models");
const NotificationModel = db.notifications;
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
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
    console.log("Unsent email notifs found: " + data.length);
    for (let i = 0; i < data.length; i++) {
      const notif = data[i];
      if (isDateLessThanToday(notif.shootDate)) {
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
      .exec();
    //? map students
    for (let i = 0; i < students.length; i++) {
      //? get guardians
      let student = students[i];
      let studentUser = student.user;
      let guardianUser = student.guardian;
      if (!studentUser.semesterNotification) {
        // create notif
        console.log("Create notif for student");
      }
      if (guardianUser && !guardianUser.semesterNotification) {
        console.log("Create notif for student's guardian");
      }
      //? check if there is no notif yet for students and guardians
      // const newNotifStudent = NotificationModel({
      //   subject: "QIT Portal",
      //   body: `Good day ${student.person.name}! This is your`,
      //   mobileNumber: personInfo.mobileNumber,
      //   smsSent: false,
      //   email: personInfo.email,
      //   emailSent: false,
      //   shootDate: d,
      // });
      // await newNotif.save();
    }
  }, 20000);
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

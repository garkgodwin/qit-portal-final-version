const db = require("../models");
const ClassModel = db.class;
const HistoryModel = db.histories;
const NotificationModel = db.notifications;
const PersonModel = db.persons;
const ScheduleModel = db.schedules;
const SchoolInfoModel = db.schoolInfo;
const StudentModel = db.students;
const StudentSubjectModel = db.studentSubjects;
const UserModel = db.users;

const bcrypt = require("bcryptjs");

const { createHistory } = require("../controllers/history.controller");
const { getSubjectDetails } = require("../helpers/get");

exports.startSeed = async () => {
  // await clearAllCollections();
  // await createSchoolInfo();
  // await createAdmin();
  //? once connected start email notifcations
  require("../controllers/notification.controller").getAndSendEmailNotifications();
  // require("../controllers/notification.controller").createAndSendNotifications7days();
  //? update grades if empty
  // await updateGradesIfEmpty();
  //? update subject details if empty
  // await updateSubjectDetails();
};

const clearAllCollections = async () => {
  console.log("System: clearing all collections.");
  await ClassModel.collection.drop();
  await HistoryModel.collection.drop();
  await NotificationModel.collection.drop();
  await PersonModel.collection.drop();
  await ScheduleModel.collection.drop();
  await SchoolInfoModel.collection.drop();
  await StudentModel.collection.drop();
  await StudentSubjectModel.collection.drop();
  await UserModel.collection.drop();
  console.log("System: collections deleted");
};

const createAdmin = async () => {
  console.log("System: creating admin");
  let adminExist = false;
  await UserModel.findOne({ role: 1 }).then((data) => {
    if (data) {
      adminExist = true;
    }
  });
  if (adminExist) {
    console.log("System: admin exist");
    return;
  }
  const user = new UserModel({
    username: "admin",
    password: bcrypt.hashSync("Qwerty123", 8),
    email: "admin1@gmail.com",
    role: 1,
    activated: true,
    locked: false,
  });
  const person = new PersonModel({
    name: "Vlad Dracula",
    age: 23,
    birthDate: "2000-01-01",
    gender: 1,
  });
  user.person = person._id;
  person.user = user._id;
  await person.save();
  await user.save();
  await createHistory(`created user admin`, true, null);
  console.log("System: admin created");
};

const createSchoolInfo = async () => {
  console.log("System: creating school info");
  const newInfo = SchoolInfoModel({
    sy: "22-23",
    sem: 1,
    startDate: "2022-06-01",
    endDate: "2023-03-01",
    current: true,
    locked: false,
  });
  await newInfo.save();
  console.log("System: created school info");
};

const createStudentsAndGuardians = async () => {};

const updateSubjectDetails = async () => {
  const subjects = await StudentSubjectModel.find({}).exec();
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    const subjectDetails = getSubjectDetails(1, subject.subjectCode);
    subject.type = subjectDetails.type;
    subject.units = subjectDetails.units;
    await subject.save();
  }
};
const updateGradesIfEmpty = async () => {
  const subjects = StudentSubjectModel.find({}).exec();
  for (let i = 0; i < subjects.length; i++) {
    const sub = subjects[i];
    if (sub.grades === null || sub.grades === undefined) {
      sub.grades = {
        prelim: 0,
        mid: 0,
        prefi: 0,
        final: 0,
      };
      await sub.save();
    }
  }
};

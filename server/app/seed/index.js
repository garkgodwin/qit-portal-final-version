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

exports.startSeed = async () => {
  // await clearAllCollections();
  // await createSchoolInfo();
  // await createAdmin();
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
  console.log("System: creating school infos");
  for (let i = 22; i < 30; i++) {
    let sy = i + "-" + (i + 1);
    let sem = 2;
    for (let x = 1; x <= sem; x++) {
      const newInfo = SchoolInfoModel({
        sy: sy,
        sem: x,
        startDate: "2023-06-01",
        endDate: "2024-03-01",
      });
      console.log(`System: creating school year: ${sy} and semester: ${x}`);
      await newInfo.save();
      await createHistory(
        `created school info for school year: ${sy} and semester: ${x}`,
        true
      );
    }
  }
  const updateInfo = await SchoolInfoModel.findOne({
    sy: "22-23",
    sem: 1,
  }).exec();
  console.log(
    `System: updating school info: ${updateInfo.sy} for semester ${updateInfo.sem} as current`
  );
  updateInfo.current = true;
  updateInfo.locked = false;
  await updateInfo.save();
  console.log(
    `System: updated school info: ${updateInfo.sy} for semester ${updateInfo.sem} as current`
  );
  console.log("System: created school infos");
};

const createStudentsAndGuardians = async () => {};

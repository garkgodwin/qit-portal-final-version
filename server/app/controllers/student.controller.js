const db = require("../models");
const PersonModel = db.persons;
const UserModel = db.users;
const StudentModel = db.students;
const NotificationModel = db.notifications;
const ClassModel = db.class;
const StudentSubjectModel = db.studentSubjects;
const { createHistory } = require("./history.controller");
const {
  generateOtp,
  generateStudentAndSchoolID,
} = require("../helpers/generate");
const {
  COLLEGE_SUBJECTS,
  SENIOR_SUBJECTS,
  JUNIOR_SUBJECTS,
} = require("../constants/school");
const {
  collegeSubjectsToArray,
  seniorSubjectsToArray,
  juniorSubjectsToArray,
  getSubjectDetails,
  subjectName,
} = require("../helpers/get");

exports.getAllStudents = async (req, res) => {
  const students = await StudentModel.find({})
    .populate({
      path: "person",
    })
    .populate({
      path: "user",
    })
    .exec();
  return res.status(200).send({
    message: "Successfully fetched all students",
    data: students,
  });
};
exports.getStudentAndSubjects = async (req, res) => {
  const id = req.params.studentID;
  const student = await StudentModel.findById(id).populate({
    path: "person",
  });
  let studentSubjects = await StudentSubjectModel.find({
    student: id,
  }).lean();

  return res.status(200).send({
    message: "Successfully fetched the students",
    data: {
      student: student,
      subjects: studentSubjects,
    },
  });
};
exports.getStudentSubjectSchedules = async (req, res) => {
  return res.status(200).send({
    message: "Successfully fetched student's subject's schedule",
    data: null,
  });
};

exports.getStudentSubjectGrades = async (req, res) => {
  return res.status(200).send({
    message: "Successfully fetched student's subject's grades",
    data: null,
  });
};

exports.getStudentSubjectAvailableToAdd = async (req, res) => {
  const id = req.params.studentID;
  const student = await StudentModel.findById(id).populate({
    path: "person",
  });
  const studentSubjects = await StudentSubjectModel.find({
    student: id,
  }).exec();

  let availableSubjectsToAdd = [];
  if (student.type === 1) {
    const arr = collegeSubjectsToArray(COLLEGE_SUBJECTS);
    arr.map((subject) => {
      if (subject.code !== studentSubjects.subjectCode) {
        availableSubjectsToAdd.push(subject);
      }
    });
  } else if (student.type === 2) {
    const arr = seniorSubjectsToArray(SENIOR_SUBJECTS);
    arr.map((subject) => {
      if (subject.code !== studentSubjects.subjectCode) {
        availableSubjectsToAdd.push(subject);
      }
    });
  } else if (student.type === 3) {
    const arr = juniorSubjectsToArray(JUNIOR_SUBJECTS);
    arr.map((subject) => {
      if (subject.code !== studentSubjects.subjectCode) {
        availableSubjectsToAdd.push(subject);
      }
    });
  } else {
    return res.status(409).send({
      message: "Student is not on student type",
    });
  }

  return res.status(200).send({
    message: "Successfully fetched the students",
    data: availableSubjectsToAdd,
  });
};
exports.addNewSubjectToStudent = async (req, res) => {
  const currentSchoolID = req.currentSchoolID;
  const id = req.params.studentID;
  const body = req.body;

  const student = await StudentModel.findById(id).exec();

  if (!student) {
    return res.status(404).send({
      message: "Student not found",
    });
  }

  const subjectDetails = getSubjectDetails(student.type, body.subjectCode);
  if (!subjectDetails) {
    return res.status(404).send({
      message: "Subject details not found with this code",
    });
  }

  let newSubject = StudentSubjectModel({
    subjectCode: body.subjectCode,
    subjectName: subjectDetails.name,
    subjectType: subjectDetails.student,
    studentType: student.type,
    yearLevelOfStudent: student.level,
    student: student,
    schoolInfo: currentSchoolID,
  });
  await newSubject.save();

  let studentSubject = await StudentSubjectModel.findById(
    newSubject._id
  ).lean();
  studentSubject.subjectName = subjectName(
    studentSubject.subjectCode,
    studentSubject.type
  );
  return studentSubject;
};

exports.createStudent = async (req, res) => {
  const body = req.body;
  const person = body.person;
  const user = body.user;
  const student = body.student;
  const currentSchoolID = req.currentSchoolID;
  const newUser = UserModel(user);
  const newPerson = PersonModel(person);
  const newStudent = StudentModel(student);

  newUser.person = newPerson._id;
  newUser.otp = generateOtp();
  newUser.role = 4;
  newPerson.user = newUser._id;
  newStudent.person = newPerson._id;
  newStudent.user = newUser._id;
  newStudent.schoolInfo = currentSchoolID;
  const ids = await generateStudentAndSchoolID();
  newStudent.studentUniqueID = ids.studentID;
  newStudent.schoolUniqueID = ids.studentID;
  await newUser.save();
  await newPerson.save();
  await newStudent.save();
  await createHistory("created a new student", false, req.userId);
  const newNotif = NotificationModel({
    subject: "QIT Portal",
    body: `Please don't share your new OTP: ${newUser.otp}`,
    mobileNumber: newPerson.mobileNumber,
    email: newUser.email,
    shootDate: "Today",
  });
  await newNotif.save();

  const createdStudent = await StudentModel.findById(newStudent._id)
    .populate({
      path: "person",
    })
    .populate({
      path: "user",
    })
    .exec();

  return res.status(200).send({
    message: "Successfully created a student",
    data: createdStudent,
  });
};
//? updates person details only
exports.updateStudent = async (req, res) => {
  const body = req.body;
  const person = body.person;
};

const {
  STUDENT_TYPES,
  COLLEGE_COURSES,
  SENIOR_COURSES,
  JUNIOR_COURSES,
  COLLEGE_SUBJECTS,
  SENIOR_SUBJECTS,
  JUNIOR_SUBJECTS,
  GRADING_SYSTEM_PER_SEM,
  ROOMS,
  COLLEGE_LEVELS,
  SENIOR_LEVELS,
  JUNIOR_LEVELS,
  COLLEGE_SECTIONS,
  SENIOR_SECTIONS,
  JUNIOR_SECTIONS,
} = require("../constants/school");
const {
  collegeSubjectsToArray,
  seniorSubjectsToArray,
  juniorSubjectsToArray,
} = require("../helpers/get");

const db = require("../models");
const UserModel = db.users;
const StudentModel = db.students;
const ClassModel = db.class;
const ScheduleModel = db.schedules;
const SchoolInfoModel = db.schoolInfo;
const StudentSubjectModel = db.studentSubjects;

exports.schoolConstants = (req, res) => {
  res.status(200).send({
    message: "Successful",
    data: {
      STUDENT_TYPES,
      COLLEGE_COURSES,
      SENIOR_COURSES,
      JUNIOR_COURSES,
      COLLEGE_SUBJECTS,
      SENIOR_SUBJECTS,
      JUNIOR_SUBJECTS,
      GRADING_SYSTEM_PER_SEM,
      ROOMS,
      COLLEGE_SECTIONS,
      JUNIOR_SECTIONS,
      SENIOR_SECTIONS,
      COLLEGE_LEVELS,
      SENIOR_LEVELS,
      JUNIOR_LEVELS,
    },
  });
};

exports.getDashboardData = async (req, res) => {
  let data = [];
  const userID = req.userId;
  const currentSchoolID = req.currentSchoolID;

  const user = await UserModel.findById(userID);
  const school = await SchoolInfoModel.findById(currentSchoolID);

  const collegeSubjectCount = collegeSubjectsToArray(COLLEGE_SUBJECTS).length;
  const seniorSubjectCount = seniorSubjectsToArray(SENIOR_SUBJECTS).length;
  const juniorSubjectCount = juniorSubjectsToArray(JUNIOR_SUBJECTS).length;
  const userCount = await UserModel.find({}).count();
  const allStudentCount = await StudentModel.find({}).count();
  const currentStudentCount = await StudentModel.find({
    schoolInfo: school._id,
  }).count();
  const allClassCount = await ClassModel.find({}).count();
  const currentClassCount = await ClassModel.find({
    schoolInfo: school._id,
  }).count();

  if (user.role === 1) {
    data = [
      {
        count: collegeSubjectCount,
        title: "College Subjects",
        path: "/subjects",
      },
      {
        count: seniorSubjectCount,
        title: "Senior Subjects",
        path: "/subjects",
      },
      {
        count: juniorSubjectCount,
        title: "Junior Subjects",
        path: "/subjects",
      },
      {
        count: userCount,
        title: "Users",
        path: "/accounts",
      },
      {
        count: allStudentCount,
        title: "All Students",
        path: "/students",
      },
      {
        count: currentStudentCount,
        title: "Current Students",
        path: "/students",
      },
      {
        count: allClassCount,
        title: "All Classes",
        path: "/classes",
      },
      {
        count: currentClassCount,
        title: "Current Classes",
        path: "/classes",
      },
    ];
  } else if (user.role === 2) {
    data = [
      {
        count: collegeSubjectCount,
        title: "College Subjects",
        path: "/subjects",
      },
      {
        count: seniorSubjectCount,
        title: "Senior Subjects",
        path: "/subjects",
      },
      {
        count: juniorSubjectCount,
        title: "Junior Subjects",
        path: "/subjects",
      },
      {
        count: allStudentCount,
        title: "All Students",
        path: "/students",
      },
      {
        count: currentStudentCount,
        title: "Current Students",
        path: "/students",
      },
      {
        count: allClassCount,
        title: "All Classes",
        path: "/classes",
      },
      {
        count: currentClassCount,
        title: "Current Classes",
        path: "/classes",
      },
    ];
  } else if (user.role === 3) {
    const instructorClasses = await ClassModel.find({
      instructor: user._id,
      schoolInfo: school._id,
    });
    let count = 0;
    instructorClasses.map((cls) => {
      count += cls.students;
    });
    data = [
      {
        count: collegeSubjectCount,
        title: "College Subjects",
        path: "/subjects",
      },
      {
        count: seniorSubjectCount,
        title: "Senior Subjects",
        path: "/subjects",
      },
      {
        count: juniorSubjectCount,
        title: "Junior Subjects",
        path: "/subjects",
      },
      {
        count: count,
        title: "Your Students",
        path: "/students",
      },
      {
        count: instructorClasses.length,
        title: "Your Classes",
        path: "/classes",
      },
    ];
  } else if (user.role === 4) {
    const student = await StudentModel.findOne({
      user: user._id,
    });

    let sprCount = 0;
    if (student.type === 1) sprCount = collegeSubjectCount;
    else if (student.type === 2) sprCount = seniorSubjectCount;
    else if (student.type === 3) sprCount = juniorSubjectCount;
    else sprCount = 0;

    const enrolledCount = await StudentSubjectModel.findOne({
      schoolInfo: school._id,
      student: student._id,
    }).count();

    data = [
      {
        count: sprCount,
        title: "Your Subjects",
        path: "/subjects",
      },
      {
        count: enrolledCount,
        title: "Enrolled Subjects",
        path: "/subjects",
      },
      {
        count: currentClassCount,
        title: "Your Classes",
        path: "/classes",
      },
    ];
  } else if (user.role === 5) {
    const student = await StudentModel.findOne({
      user: user._id,
    });

    let sprCount = 0;
    if (student.type === 1) sprCount = collegeSubjectCount;
    else if (student.type === 2) sprCount = seniorSubjectCount;
    else if (student.type === 3) sprCount = juniorSubjectCount;
    else sprCount = 0;

    const enrolledCount = await StudentSubjectModel.findOne({
      schoolInfo: school._id,
      student: student._id,
    }).count();

    data = [
      {
        count: sprCount,
        title: "Your Student's Subjects",
        path: "/subjects",
      },
      {
        count: enrolledCount,
        title: "Your Student's Enrolled Subjects",
        path: "/subjects",
      },
      {
        count: currentClassCount,
        title: "Your Student's Classes",
        path: "/classes",
      },
    ];
  } else {
    data = [];
  }

  return res.status(200).send({
    message: "Successfully fetched the dashboard data for this user.",
    data: data,
  });
};

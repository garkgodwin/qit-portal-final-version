const db = require("../models");
const PersonModel = db.persons;
const UserModel = db.users;
const StudentModel = db.students;
const NotificationModel = db.notifications;
const ClassModel = db.class;
const SchoolInfoModel = db.schoolInfo;
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
  getSubjectTotalGrade,
  getSemTotalGrade,
} = require("../helpers/get");

exports.getAllStudents = async (req, res) => {
  const userID = req.userId;
  const type = req.params.type;

  const schoolCurrent = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();

  let filter = {};
  if (type === "current" && schoolCurrent) {
    filter = {
      ...filter,
      schoolInfo: schoolCurrent._id,
    };
  }

  const user = await UserModel.findById(userID);
  let students = [];
  let formattedStudents = [];
  if (user.role === 1 || user.role === 2) {
    students = await StudentModel.find(filter)
      .populate({
        path: "person",
      })
      .populate({
        path: "user",
      })
      .populate({
        path: "guardian",
        populate: {
          path: "person",
        },
      })
      .lean();
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      student.subjectCount = await StudentSubjectModel.find({
        student: student._id,
      }).count();
      formattedStudents.push(student);
    }
  }
  return res.status(200).send({
    message: "Successfully fetched all students",
    data: formattedStudents,
  });
};
exports.getStudentDetailsForUpdate = async (req, res) => {
  const id = req.params.studentID;
  const student = await StudentModel.findById(id).populate({
    path: "person",
  });
  if (!student) {
    return res.status(404).send({
      message: "Student does not exist",
    });
  }
  return res.status(200).send({
    message: "Successfully fetched the student for update",
    data: student,
  });
};
exports.updateStudentDetails = async (req, res) => {
  const id = req.params.studentID;
  const body = req.body;
  const si = body.student;
  let student = await StudentModel.findById(id);
  if (!student) {
    return res.status(404).send({
      message: "Student does not exist",
    });
  }
  student.level = si.level;
  await student.save();
  return res.status(200).send({
    message: "Successfully updated a student",
    data: student,
  });
};
exports.getStudentAndSubjects = async (req, res) => {
  const id = req.params.studentID;
  let student = await StudentModel.findById(id)
    .populate({
      path: "person",
    })
    .lean();

  let studentSubjects = await StudentSubjectModel.find({
    student: id,
  })
    .populate({
      path: "schoolInfo",
    })
    .lean();

  studentSubjects = studentSubjects.map((subject) => {
    const total = getSubjectTotalGrade(subject);
    subject.grades.total = total;
    return subject;
  });
  student = {
    ...student,
    subjects: studentSubjects,
  };

  return res.status(200).send({
    message: "Successfully fetched the students",
    data: student,
  });
};
exports.getStudentSubjectDetails = async (req, res) => {
  const { studentID, subjectID } = req.params;
  if (!studentID) {
    return res.status(404).send({
      message: "Not found",
    });
  }
  if (!subjectID) {
    return res.status(404).send({
      message: "Not found",
    });
  }
  const student = await StudentModel.findById(studentID).exec();
  if (!student) {
    return res.status(404).send({
      message: "Student is not found",
    });
  }
  const studentSubject = await StudentSubjectModel.findOne({
    student: student._id,
    _id: subjectID,
  }).exec();
  if (!studentSubject) {
    return res.status(404).send({
      message: "Subject is not found",
    });
  }

  return res.status(200).send({
    message: "Successfully fetched the student's subject details",
    data: studentSubject,
  });
};
exports.getStudentSubjectSchedules = async (req, res) => {
  return res.status(200).send({
    message: "Successfully fetched student's subject's schedule",
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

  let subs = [];
  const subjects = collegeSubjectsToArray(COLLEGE_SUBJECTS);
  for (let i = 0; i < subjects.length; i++) {
    let flag = true;
    const subject = subjects[i];
    for (let j = 0; j < studentSubjects.length; j++) {
      const existingSubject = studentSubjects[j];
      if (existingSubject.subjectCode === subject.code) {
        if (existingSubject.status === 0 || existingSubject === 2) {
          flag = false;
        }
      }
    }
    if (flag) {
      subs.push(subject);
    }
  }

  console.log(studentSubjects.length);

  console.log(subjects.length);
  console.log(subs.length);
  return res.status(200).send({
    message: "Successfully fetched the available subjects for this student",
    data: subs,
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

  const subjects = await StudentSubjectModel.find({
    student: student._id,
  }).exec();
  for (let i = 0; i < subjects.length; i++) {
    const sub = subjects[i];
    if (sub.subjectCode === body.subjectCode && sub.status === 0) {
      return res.status(409).send({
        message: "This subject has already been added for this student",
      });
    }
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
    units: subjectDetails.units,
    type: subjectDetails.type,
    status: 0,
    schoolInfo: currentSchoolID,
    grades: {
      prelim: 0,
      mid: 0,
      prefi: 0,
      final: 0,
    },
  });
  await newSubject.save();

  return res.status(200).send({
    message: "Successfully added a new subject for this student",
    data: newSubject,
  });
};

//? GUARDIANS

exports.getStudentGuardians = async (req, res) => {
  const id = req.params.studentID;
  if (!id) {
    return res.status(404).send({
      message: "Student not found",
    });
  }
  const student = await StudentModel.findById(id)
    .populate({
      path: "guardian",
      populate: {
        path: "person",
      },
    })
    .exec();

  if (!student) {
    return res.status(404).send({
      message: "Student not found",
    });
  }
  if (!student.guardian) {
    return res.status(404).send({
      message: "Guardian does not exist",
    });
  }
  const guardians = [student.guardian];
  return res.status(200).send({
    message: "Successfully fetched the guardians of this student",
    data: guardians,
  });
};
exports.addGuardian = async (req, res) => {
  const id = req.params.studentID;
  const b = req.body;
  let userInput = b.user;
  userInput = {
    ...userInput,
    role: 5,
  };
  let personInput = {
    ...b.person,
    age: parseInt(b.person.age),
    gender: parseInt(b.person.gender),
  };

  /*
    creating a guardian
    1. Main get student
    2. create guardian info
      - create user info
      - create person info
    3. add user id to student guardians
  */
  if (!id) {
    return res.status(404).send({
      message: "Student not found",
    });
  }
  let student = await StudentModel.findById(id).exec();
  if (!student) {
    return res.status(404).send({
      message: "Student not found",
    });
  }
  if (student.guardian) {
    return res.status(409).send({
      message: "Only one guardian can be added",
    });
  }
  let userInfo = UserModel(userInput);
  let personInfo = PersonModel(personInput);
  userInfo.person = personInfo._id;
  userInfo.otp = generateOtp();
  personInfo.user = userInfo._id;
  student.guardian = userInfo._id;
  await userInfo.save();
  await personInfo.save();
  await student.save();
  await createHistory("created a new guardian", false, req.userId);
  const d = new Date().toISOString().substring(0, 10);
  const newNotif = NotificationModel({
    subject: "QIT Portal",
    body: `Please don't share your new OTP: ${userInfo.otp}`,
    mobileNumber: personInfo.mobileNumber,
    smsSent: false,
    email: personInfo.email,
    emailSent: false,
    shootDate: d,
  });
  await newNotif.save();
  const guardian = await UserModel.findById(userInfo._id).populate({
    path: "person",
  });

  return res.status(200).send({
    message: "Successfully created a guardian",
    data: guardian,
  });
};
exports.getStudentReport = async (req, res) => {
  let data = {
    text: "",
    grade: 0,
    point: 5,
  };

  // get current school data
  // get student details
  // get student total grades
  // get student point
  const school = await SchoolInfoModel.findOne({
    current: true,
    locked: false,
  }).exec();
  if (!school) {
    return res.status(409).send({
      message: "There are no current school year and semester",
    });
  }
  const student = await StudentModel.findById(req.params.studentID)
    .populate({
      path: "person",
    })
    .exec();

  if (!student) {
    return res.status(404).send({
      message: "Student is not found",
    });
  }

  const subjects = await StudentSubjectModel.find({
    student: student._id,
  }).exec();

  const grade = getSemTotalGrade(subjects);

  console.log("Reports all good");
  data = {
    text: `${student.person.gender === 1 ? "Mr." : "Ms."} ${
      student.person.name
    } has a grade of 
    ${grade.total} for 100 percentile with the general weighted average of ${
      grade.point
    } for the school year: ${school.sy}
     and semester: ${school.sem}
    `,
    grade: grade.total,
    point: grade.point,
  };

  return res.status(200).send({
    message: "Successfully fetched the student report",
    data: data,
  });
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
  const d = new Date().toISOString().substring(0, 10);
  const newNotif = NotificationModel({
    subject: "QIT Portal",
    body: `Please don't share your new OTP: ${newUser.otp}`,
    mobileNumber: newPerson.mobileNumber,
    email: newPerson.email,
    shootDate: d,
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

//? GRADES
exports.updateGrade = async (req, res) => {
  const studentID = req.params.studentID;
  const subjectID = req.params.subjectID;
  const b = req.body;
  let grades = b;
  grades = {
    ...grades,
    prelim: parseInt(grades.prelim),
    mid: parseInt(grades.mid),
    prefi: parseInt(grades.prefi),
    final: parseInt(grades.final),
  };

  const student = await StudentModel.findById(studentID);
  const subject = await StudentSubjectModel.findOne({
    _id: subjectID,
    student: studentID,
  });
  if (!student) {
    return res.status(404).send({
      message: "Please select a student",
    });
  }
  if (!subject) {
    return res.status(404).send({
      message: "Please select a student",
    });
  }

  const update = {
    grades: grades,
  };
  let success = false;
  await StudentSubjectModel.findByIdAndUpdate(subject._id, update)
    .then((d) => {
      success = true;
    })
    .catch((error) => {
      return res.status(500).send({
        message: "Failed to update subject grades",
      });
    });

  if (!success) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
  const sub = await StudentSubjectModel.findById(subject._id).lean();
  const total = getSubjectTotalGrade(sub);
  sub.total = total;
  return res.status(200).send({
    message: "Successfully added a grade for this term",
    data: sub,
  });
};

//? MOVE TO CURRENT SEM
exports.moveStudentToCurrentSem = async (req, res) => {
  const id = req.params.studentID;
  const currentSchoolID = req.currentSchoolID;
  let student = await StudentModel.findById(id);
  if (!student) {
    return res.status(404).send({
      message: "Student does not exist",
    });
  }
  student.schoolInfo = currentSchoolID;
  await student.save();
  return res.status(200).send({
    message: "Student is now moved to current school year and semester",
  });
};

//? NOTIFY STUDENTS
exports.notifyStudents = async (req, res) => {
  const type = req.params.type;
  if (!type) {
    return res.status(409).send({
      message: "Please select a type of notification",
    });
  }
  console.log(type);
};

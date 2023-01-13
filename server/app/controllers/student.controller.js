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
  const userID = req.userId;
  const user = await UserModel.findById(userID);
  let students = [];
  if (user.role === 1 || user.role === 2) {
    students = await StudentModel.find({})
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
      .exec();
  }
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

  const subjects = await StudentSubjectModel.find({
    student: student._id,
  }).exec();
  for (let i = 0; i < subjects.length; i++) {
    const sub = subjects[i];
    if (sub.subjectCode === body.subjectCode) {
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
    schoolInfo: currentSchoolID,
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
exports.createGrade = async (req, res) => {
  const studentID = req.params.studentID;
  const subjectID = req.params.subjectID;
  const b = req.body;
  const term = parseInt(b.term); // 1- prelim, 2 - mid, 3 - prefi, 4 - final
  const type = parseInt(b.type); // 1 - quiz , 2 - activity, 3 - quiz, 4- exam
  const achieved = parseInt(b.achieved);
  const total = parseInt(b.total);
  console.log(b);

  //? CHECKS
  if (type > 4 || type < 1) {
    return res.status(409).send({
      message: "Please select a grade type",
    });
  }
  if (term > 4 || term < 1) {
    return res.status(409).send({
      message: "Please select a term",
    });
  }
  if (!achieved || !total) {
    return res.status(409).send({
      message: "Please enter the total or achieved for this grade",
    });
  }
  if (total === 0) {
    return res.status(409).send({
      message: "Total grade must not be 0",
    });
  }
  if (achieved > total) {
    return res.status(409).send({
      message: "Achieved grade must not be greater than total grade",
    });
  }

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
  //? GRADE POPULATION
  let prelim = subject.grades.prelim;
  let mid = subject.grades.mid;
  let prefi = subject.grades.prefi;
  let final = subject.grades.final;
  if (term === 1) {
    if (type === 4) {
      if (
        prelim.exam === null ||
        (Object.keys(prelim.exam).length === 0 &&
          prelim.exam.constructor === Object)
      ) {
        return res.status(409).send({
          message: "Prelim exam has already been filled.",
        });
      } else {
        prelim.exam.total = total;
        prelim.exam.achieved = achieved;
      }
    } else if (type === 3) {
      prelim.performance = [
        ...prelim.performance,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 2) {
      prelim.activity = [
        ...prelim.activity,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 1) {
      prelim.quiz = [
        ...prelim.quiz,
        {
          total: total,
          achieved: achieved,
        },
      ];
    }
  } else if (term === 2) {
    if (type === 4) {
      if (
        mid.exam === null ||
        (Object.keys(mid.exam).length === 0 && mid.exam.constructor === Object)
      ) {
        return res.status(409).send({
          message: "Midterm exam has already been filled.",
        });
      } else {
        mid.exam.total = total;
        mid.exam.achieved = achieved;
      }
    } else if (type === 3) {
      mid.performance = [
        ...mid.performance,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 2) {
      mid.activity = [
        ...mid.activity,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 1) {
      mid.quiz = [
        ...mid.quiz,
        {
          total: total,
          achieved: achieved,
        },
      ];
    }
  } else if (term === 3) {
    if (type === 4) {
      if (
        prefi.exam === null ||
        (Object.keys(prefi.exam).length === 0 &&
          prefi.exam.constructor === Object)
      ) {
        return res.status(409).send({
          message: "Prefi exam has already been filled.",
        });
      } else {
        prefi.exam.total = total;
        prefi.exam.achieved = achieved;
      }
    } else if (type === 3) {
      prefi.performance = [
        ...prefi.performance,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 2) {
      prefi.activity = [
        ...prefi.activity,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 1) {
      prefi.quiz = [
        ...prefi.quiz,
        {
          total: total,
          achieved: achieved,
        },
      ];
    }
  } else if (term === 4) {
    if (type === 4) {
      if (
        final.exam === null ||
        (Object.keys(final.exam).length === 0 &&
          final.exam.constructor === Object)
      ) {
        return res.status(409).send({
          message: "Final exam has already been filled.",
        });
      } else {
        final.exam.total = total;
        final.exam.achieved = achieved;
      }
    } else if (type === 3) {
      final.performance = [
        ...final.performance,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 2) {
      final.activity = [
        ...final.activity,
        {
          total: total,
          achieved: achieved,
        },
      ];
    } else if (type === 1) {
      final.quiz = [
        ...final.quiz,
        {
          total: total,
          achieved: achieved,
        },
      ];
    }
  }

  const update = {
    grades: {
      prelim: prelim,
      mid: mid,
      prefi: prefi,
      final: final,
    },
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
    return req.status(500).send({
      message: "Something went wrong",
    });
  }
  const sub = await StudentSubjectModel.findById(subject._id).exec();
  return res.status(200).send({
    message: "Successfully added a grade for this term",
    data: sub,
  });
};

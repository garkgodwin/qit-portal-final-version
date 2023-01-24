const db = require("../models");
const ClassModel = db.class;
const StudentModel = db.students;
const StudentSubjectModel = db.studentSubjects;
const InstructorModel = db.class;
const UserModel = db.users;
const { createHistory } = require("./history.controller");
const { subjectName } = require("../helpers/get");

exports.getAllClasses = async (req, res) => {
  const user = await UserModel.findById(req.userId);
  const currentSchoolID = req.currentSchoolID;
  const classes = await ClassModel.find({
    schoolInfo: currentSchoolID,
  })
    .populate({
      path: "instructor",
      populate: {
        path: "person",
      },
    })
    .lean();

  let formattedClasses = classes.map((cls) => {
    cls.name = subjectName(cls.subjectCode, cls.studentType);
    return cls;
  });

  let filteredClasses = [];
  if (user.role === 3) {
    filteredClasses = await ClassModel.find({
      instructor: user._id,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "person",
        },
      })
      .lean();
    filteredClasses = filteredClasses.map((cls) => {
      cls.name = subjectName(cls.subjectCode, cls.studentType);
      return cls;
    });
  } else if (user.role === 4 || user.role === 5) {
    // student and guardian
    const student = await StudentModel.findOne({
      user: user._id,
    });
    filteredClasses = formattedClasses.filter((cls) => {
      const students = cls.students;
      for (let i = 0; i < students; i++) {
        if (students[i] === student._id) {
          return cls;
        }
      }
    });
  } else {
    // admin or registrar view
    filteredClasses = formattedClasses;
  }

  return res.status(200).send({
    message:
      "Successfully fetched the classes for this school year and semester",
    data: filteredClasses,
  });
};

exports.createClass = async (req, res) => {
  const body = req.body;
  let classInput = body.class;
  const currentSchoolID = req.currentSchoolID;
  const userID = req.userId;
  classInput.schoolInfo = currentSchoolID;
  const newClass = ClassModel(classInput);
  await newClass.save();
  let type =
    newClass.studentType === 1
      ? "college"
      : newClass.studentType === 2
      ? "senior high"
      : newClass.studentType === 3
      ? "junior high"
      : "";
  await createHistory(
    `created a new class for ${type} subject ${classInput.subjectCode}`,
    false,
    userID
  );
  let createdClass = await ClassModel.findById(newClass._id)
    .populate({
      path: "instructor",
      populate: {
        path: "person",
      },
    })
    .lean();

  createdClass.name = subjectName(
    createdClass.subjectCode,
    createdClass.studentType
  );

  return res.status(200).send({
    message: "Successfully created a new class",
    data: createdClass,
  });
};
exports.updateClass = async (req, res) => {};
exports.getClass = async (req, res) => {
  const classID = req.params.classID;
  if (!classID) {
    return res.status(404).send({
      message: "Class is not found",
    });
  }

  const classData = await ClassModel.findById(classID)
    .populate({
      path: "instructor",
      populate: {
        path: "person",
      },
    })
    .populate({
      path: "students",
      populate: {
        path: "person",
      },
    })
    .lean();

  classData.subjectName = subjectName(
    classData.subjectCode,
    classData.studentType
  );

  return res.status(200).send({
    message: "Successfully fetched the class data",
    data: classData,
  });
};
exports.getStudentsAvailable = async (req, res) => {
  const classID = req.params.classID;
  const currentSchoolID = req.currentSchoolID;
  if (!classID) {
    return res.status(404).send({
      message: "Class is not found",
    });
  }

  const classData = await ClassModel.findById(classID)
    .populate({
      path: "instructor",
      populate: {
        path: "person",
      },
    })
    .exec();

  if (!classData) {
    return res.status(404).send({
      message: "Class information is not found",
    });
  }

  const cStudents = classData.students;
  let students = await StudentModel.find({
    schoolInfo: currentSchoolID,
  }).populate({
    path: "person",
  });

  students = students.filter((student) => {
    let se = false;
    for (let i = 0; i < cStudents.length; i++) {
      if (student._id === cStudents[i]) {
        se = true;
        break;
      }
    }
    return !se;
  });

  return res.status(200).send({
    message: "Successfully fetched the students available",
    data: students,
  });
};
exports.addStudentToClass = async (req, res) => {
  const { classID, studentID } = req.params;

  //? check if classID or student id exist
  if (!classID) {
    return res.status(404).send({
      message: "No class found",
    });
  }
  const classData = await ClassModel.findById(classID).exec();
  if (!classData) {
    return res.status(404).send({
      message: "No class found",
    });
  }
  if (!studentID) {
    return res.status(404).send({
      message: "No student found",
    });
  }
  const student = await StudentModel.findById(studentID)
    .populate({
      path: "person",
    })
    .exec();
  if (!student) {
    return res.status(404).send({
      message: "No student found",
    });
  }

  //? check if students has this subject in class
  let studentSubject = await StudentSubjectModel.findOne({
    student: studentID,
    subjectCode: classData.subjectCode,
  }).exec();
  if (!studentSubject) {
    return res.status(404).send({
      message: "Student has no subject for this class",
    });
  }

  /*

   for (let i = 0; i < classData.students.length; i++) {
    const studentID = classData.students[i];
    if (studentID === student._id) {
      return res.status(409).send({
        message: "Student is already in this class",
      });
    }
  }

  */
  if (classData.students.includes(student._id)) {
    return res.status(409).send({
      message: "Student is already in this class",
    });
  }
  /*
    to add student
    update class model
    update student subject model
  */
  classData.students = [...classData.students, studentID];
  await classData.save();
  studentSubject.class = classData._id;
  await studentSubject.save();

  return res.status(200).send({
    message: "Successfully added student to this class",
    data: student,
  });
};

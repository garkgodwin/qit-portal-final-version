const db = require("../models");
const ClassModel = db.class;
const StudentModel = db.students;
const StudentSubjectModel = db.studentSubjects;
const InstructorModel = db.class;
const { createHistory } = require("./history.controller");
const { subjectName } = require("../helpers/get");

exports.getAllClasses = async (req, res) => {
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

  return res.status(200).send({
    message:
      "Successfully fetched the classes for this school year and semester",
    data: formattedClasses,
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

  //? codeCode
  //? subjectType
  //? studentType

  // if classcode = subject code of student subjects
  // if classtudenttype = subject type

  let studentSubjects = await StudentSubjectModel.find({
    schoolInfo: currentSchoolID,
    subjectCode: classData.subjectCode,
    subjectType: classData.studentType,
  })
    .populate({
      path: "student",
      populate: {
        path: "person",
      },
    })
    .exec();

  const students = studentSubjects.map((subs) => {
    return subs.student;
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

  //? check if student is already in class
  const students = classData.students;
  const exists = students.includes(student._id);
  if (exists) {
    return res.status(409).send({
      message: "Student is already in class",
    });
  }

  //? check if students has this subject in class
  const studentSubject = await StudentSubjectModel.findOne({
    student: studentID,
    subjectCode: classData.subjectCode,
    subjectType: classData.studentType,
  }).exec();
  if (!studentSubject) {
    return res.status(404).send({
      message: "Student has no subject for this class",
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

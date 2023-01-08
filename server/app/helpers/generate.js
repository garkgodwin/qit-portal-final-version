const db = require("../models");
const StudentModel = db.students;
const otpGenerator = require("otp-generator");
var bcrypt = require("bcryptjs");

exports.generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: false,
  });
  return otp;
};

exports.generateHashedPassword = (rawPassword) => {
  return bcrypt.hashSync(rawPassword, 8);
};

exports.generateStudentAndSchoolID = async () => {
  //format: 00-00-0000
  //1st 00 =
  //2nd 00 = increment by 1 if 0000 reached 9999
  //0000 = increment by 1 from last ID
  //schoolID is 8-digits
  const lastStudent = await StudentModel.findOne().sort({ _id: -1 });

  if (lastStudent) {
    const studentID = lastStudent.studentUniqueID;
    const schoolID = lastStudent.schoolUniqueID;
    //?student ID increment block
    const id1Array = studentID.split("-");
    let firstStudentChar = "";
    let middleStudentChar = "";
    let lastStudentChar = "";
    //? last char of student id
    if (id1Array[2] === "9999") {
      lastStudentChar = "0000";
      //? middle
      if (id1Array[1] === "99") {
        middleStudentChar = "00";
        //? first
        if (id1Array[0] === "99") {
          firstStudentChar = "";
        } else {
          firstStudentChar = (parseInt(id1Array[0]) + 1).toString();
          if (firstStudentChar.length === 1)
            firstStudentChar = "0" + firstStudentChar;
        }
      } else {
        middleStudentChar = (parseInt(id1Array[1]) + 1).toString();
        if (middleStudentChar.length === 1)
          middleStudentChar = "0" + middleStudentChar;
        //? first
        if (id1Array[0] === "99") {
          firstStudentChar = "";
        }
      }
    } else {
      lastStudentChar = (parseInt(id1Array[2]) + 1).toString();
      if (lastStudentChar.length === 1)
        lastStudentChar = "000" + lastStudentChar;
      if (lastStudentChar.length === 2)
        lastStudentChar = "00" + lastStudentChar;
      if (lastStudentChar.length === 3) lastStudentChar = "0" + lastStudentChar;
      middleStudentChar = id1Array[1];
      firstStudentChar = id1Array[0];
    }
    //? school ID increment block
    let numSchoolID = (parseInt(schoolID) + 1).toString();
    if (numSchoolID.length === 1) numSchoolID = "0000000" + numSchoolID;
    if (numSchoolID.length === 2) numSchoolID = "000000" + numSchoolID;
    if (numSchoolID.length === 3) numSchoolID = "00000" + numSchoolID;
    if (numSchoolID.length === 4) numSchoolID = "0000" + numSchoolID;
    if (numSchoolID.length === 5) numSchoolID = "000" + numSchoolID;
    if (numSchoolID.length === 6) numSchoolID = "00" + numSchoolID;
    if (numSchoolID.length === 7) numSchoolID = "0" + numSchoolID;

    return {
      studentID:
        firstStudentChar + "-" + middleStudentChar + "-" + lastStudentChar,
      schoolID: numSchoolID,
    };
  } else {
    return {
      studentID: "00-00-0001",
      schoolID: "00000001",
    };
  }
};

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
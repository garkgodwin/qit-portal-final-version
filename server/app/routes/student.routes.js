const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/student.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.getAllStudents
  );
  router.get(
    "/:studentID/subjects",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.getStudentAndSubjects
  );
  router.get(
    "/:studentID/subjects/:subjectID/scedules",
    [authJwt.verifyToken],
    controller.getStudentSubjectSchedules
  );
  router.get(
    "/:studentID/subjects/:subjectID/grades",
    [authJwt.verifyToken],
    controller.getStudentSubjectGrades
  );

  router.get(
    "/:studentID/subjects-available-to-add",
    [authJwt.verifyToken, authJwt.isRegistrar, check.SchoolHasCurrent],
    controller.getStudentSubjectAvailableToAdd
  );
  router.post(
    "/:studentID/new-subject",
    [
      authJwt.verifyToken,
      authJwt.isRegistrar,
      authJwt.isAdmin,
      check.SchoolHasCurrent,
    ],
    controller.addNewSubjectToStudent
  );
  router.post(
    "/",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.UsernameUnique,
      check.EmailUnique,
      check.MobileUnique,
      check.NameUnique,
      check.SchoolHasCurrent,
    ],
    controller.createStudent
  );
  router.put(
    "/:personID",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.UsernameUnique,
      check.EmailUnique,
      check.MobileUnique,
      check.NameUnique,
      check.SchoolHasCurrent,
    ],
    controller.updateStudent
  );

  router.post(
    "/:studentID/subjects/:subjectID/new-grade",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.createGrade
  );
  app.use("/api/v1/students", router);
};

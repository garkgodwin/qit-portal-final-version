const authJwt = require("../middlewares/authJWT");
const check = require("../middlewares/check");
const controller = require("../controllers/student.controller");
let router = require("express").Router();

module.exports = function (app) {
  router.get(
    "/:type",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.getAllStudents
  );

  router.get(
    "/:studentID/details-for-update",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      authJwt.isRegistrar,
      authJwt.isInstructor,
    ],
    controller.getStudentDetailsForUpdate
  );
  router.put(
    "/:studentID/details-for-update",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.MobileUnique,
      check.NameUnique,
      check.SchoolHasCurrent,
    ],
    controller.updateStudentDetails
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
    "/:studentID/subjects/:subjectID",
    [authJwt.verifyToken],
    controller.getStudentSubjectDetails
  );
  router.get(
    "/:studentID/subjects/:subjectID/scedules",
    [authJwt.verifyToken],
    controller.getStudentSubjectSchedules
  );
  router.get(
    "/:studentID/guardians",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getStudentGuardians
  );
  router.post(
    "/:studentID/guardians",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      check.EmailUnique,
      check.NameUnique,
      check.UsernameUnique,
    ],
    controller.addGuardian
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

  router.put(
    "/:studentID/subjects/:subjectID/update-grade",
    [authJwt.verifyToken, authJwt.isInstructor],
    controller.updateGrade
  );

  router.put(
    "/:studentID/move",
    [authJwt.verifyToken, authJwt.isAdmin, check.SchoolHasCurrent],
    controller.moveStudentToCurrentSem
  );

  router.post(
    "/notify/:type",
    [authJwt.verifyToken, authJwt.isRegistrar],
    controller.notifyStudents
  );

  app.use("/api/v1/students", router);
};

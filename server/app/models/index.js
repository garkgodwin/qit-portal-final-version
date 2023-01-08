const mongoose = require("mongoose");
Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

//? PERSONAL DETAILS
db.persons = require("./person.model")(mongoose);
db.users = require("./user.model")(mongoose);
db.students = require("./student.model")(mongoose);
db.grades = require("./grade.model")(mongoose);
db.class = require("./class.model")(mongoose);
db.schedules = require("./schedule.model")(mongoose);
db.schoolInfo = require("./schoolInfo.model")(mongoose);
db.notifications = require("./notification.model")(mongoose);
db.studentSubjects = require("./studentSubject.model")(mongoose);
db.histories = require("./history.model")(mongoose);

module.exports = db;

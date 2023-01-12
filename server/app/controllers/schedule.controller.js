const e = require("express");
const { getDay } = require("../helpers/get");
const db = require("../models");
const ScheduleModel = db.schedules;
const ClassModel = db.class;

exports.getAllSchedules = async (req, res) => {
  const currentSchoolID = req.currentSchoolID;
  const pop = {
    path: "class",
    populate: {
      path: "instructor",
      select: "person",
      populate: {
        path: "person",
        select: "name",
      },
    },
  };

  const schedules = await ScheduleModel.find({
    schoolData: currentSchoolID,
  })
    .populate(pop)
    .exec();

  return res.status(200).send({
    message: "Successfully fetched all schedules",
    data: schedules,
  });
};

exports.getSchedulePerDayAndTime = async (req, res) => {
  const currentSchoolID = req.currentSchoolID;
  let { day, time } = req.params;
  time = parseInt(time.split(":")[0]);

  const pop = {
    path: "class",
    populate: {
      path: "instructor",
      select: "person",
      populate: {
        path: "person",
        select: "name",
      },
    },
  };

  const schedules = await ScheduleModel.find({
    schoolData: currentSchoolID,
    day: parseInt(day),
    $or: [{ timeStart: time }, { timeEnd: time }],
  })
    .populate(pop)
    .exec();
  return res.status(200).send({
    message: "Successfully fetched schedules for this day and time",
    data: schedules,
  });
};

exports.createSchedule = async (req, res) => {
  const b = req.body;
  const timeStart =
    typeof b.timeStart === "string" ? parseInt(b.timeStart) : b.timeStart;
  const timeEnd =
    typeof b.timeEnd === "string" ? parseInt(b.timeEnd) : b.timeEnd;
  const day = typeof b.day === "string" ? parseInt(b.day) : b.day;
  /*
  to create a schedule
  MAIN: check inputs if right
  1. check if class exists
  2. get all schedules on current school data
  3. filter classes with day and time and room 
  */

  if (b.classID === "" || b.room === "") {
    return res.status(404).send({
      message: "Please fill in the fields",
    });
  }

  if (timeStart > timeEnd) {
    return res.status(409).send({
      message: "Please make sure the end time is greater than the start time",
    });
  }
  if (timeStart === timeEnd) {
    return res.status(409).send({
      message: "Please make sure the start time is not equal to end time",
    });
  }

  const currentSchoolID = req.currentSchoolID;
  const classData = await ClassModel.findById(b.classID);
  if (!classData) {
    return res.status(404).send({
      message: "Class is not found",
    });
  }

  //? check if we can create a new schedule
  const schedules = await ScheduleModel.find({
    schoolData: currentSchoolID,
  })
    .populate({ path: "class" })
    .exec();
  let canCreate = true;
  let message = "Can create schedule";
  if (schedules.length === 0) {
    canCreate = true;
  } else {
    //? can create check
    for (let i = 0; i < schedules.length; i++) {
      const sched = schedules[i];
      if (sched.room === b.room && sched.day === day) {
        // check if timestart is within an existing schedule
        // check if time end is the same above
        // check if sched time start is within time start and time end
        // check if sched time end is within time start and time end
        if (
          sched.class.subjectCode === classData.subjectCode &&
          sched.class.studentType === classData.studentType
        ) {
          canCreate = false;
          message = "Cannot create a schedule of the same subject.";
          break;
        } else if (sched.timeStart < timeStart && sched.timeEnd > timeStart) {
          canCreate = false;
          message = "Schedules cannot overlap";
          break;
        } else if (sched.timeStart < timeEnd && sched.timeEnd > timeEnd) {
          canCreate = false;
          message = "Schedules cannot overlap";
          break;
        } else if (timeStart < sched.timeStart && timeEnd > sched.timeStart) {
          canCreate = false;
          message = "Schedules cannot overlap";
          break;
        } else if (timeStart < sched.timeEnd && timeEnd > sched.timeEnd) {
          canCreate = false;
          message = "Schedules cannot overlap";
          break;
        } else if (timeStart === sched.timeStart && timeEnd === sched.timeEnd) {
          canCreate = false;
          message = "Schedules cannot overlap";
        } else {
          canCreate = true;
        }
      }
    }
  }
  if (!canCreate) {
    return res.status(409).send({
      message: message,
    });
  }

  const newSched = ScheduleModel({
    class: classData._id,
    room: b.room,
    day: day,
    timeStart: timeStart,
    timeEnd: timeEnd,
    schoolData: currentSchoolID,
  });
  await newSched.save();

  const createdSched = await ScheduleModel.findById(newSched._id)
    .populate({
      path: "class",
      populate: {
        path: "instructor",
        select: "person",
        populate: {
          path: "person",
          select: "name",
        },
      },
    })
    .exec();
  return res.status(200).send({
    message: "Successfully created a new schedule",
    data: createdSched,
  });
};

exports.updateSchedule = async (req, res) => {};

exports.getSchedule = async (req, res) => {};

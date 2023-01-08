module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      class: {
        type: Schema.Types.ObjectId,
        ref: "classes",
      },
      room: {
        type: String, // room from constants only
      },
      day: {
        type: Number, //1 = monday, 2 = tuesday, 3 = wednesday, and so on
      },
      timeStart: {
        type: Number, //24 hour format save
      },
      timeEnd: {
        type: Number, //24 hour format save
      },
      schoolData: {
        type: Schema.Types.ObjectId,
        ref: "schoolInfos",
      },
    },
    { timestamps: true }
  );

  const Schedule = model("schedules", schema);

  return Schedule;
};

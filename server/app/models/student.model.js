module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      person: {
        type: Schema.Types.ObjectId,
        ref: "persons",
      },
      studentUniqueID: {
        type: String,
      },
      schoolUniqueID: {
        type: String,
      },
      course: String, //? BSIT, BSBA, TLE,
      level: Number, //? 1 2 3 4
      section: String, //? A, B, C
      type: Number, // 1 - college, 2 - Senior highschool, 3 - Junior Highschool
      guardian: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      schoolInfo: {
        type: Schema.Types.ObjectId,
        ref: "schoolInfos",
      },
    },
    { timestamps: true }
  );

  const Student = model("students", schema);

  return Student;
};

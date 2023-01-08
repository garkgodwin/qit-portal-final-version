module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      subjectCode: {
        type: String,
        required: true,
      },
      class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "classes",
      },
      instructor: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      student: {
        type: Schema.Types.ObjectId,
        ref: "students",
      },
      term: {
        type: Number,
      },
      level: {
        type: Number, // 1 2 3 4 7 8 9 10 11 12
      },
      type: {
        type: Number,
      }, // THIS WOULD BE: 1 - QUIZ, 2 - Activities, 3  - Performance, 4 - TERM EXAM
      achieved: {
        type: Number,
      },
      total: {
        type: Number,
      },
      description: {
        type: String,
      },
      schoolData: {
        type: Schema.Types.ObjectId,
        ref: "schoolData",
      },
    },
    { timestamps: true }
  );

  const Grade = model("grades", schema);

  return Grade;
};

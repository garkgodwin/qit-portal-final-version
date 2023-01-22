module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      subjectCode: {
        type: String,
        required: true,
      },
      subjectName: {
        type: String,
        required: true,
      },
      units: {
        //? Number of units for this subject
        type: Number,
        required: true,
      },
      type: {
        //? major || minor || extra
        type: String,
        required: true,
      },
      subjectType: {
        type: Number, // recommended student student type
      },
      studentType: {
        type: Number, //1 - college, 2 - senior high, 3 - junior high
      },
      yearLevelOfStudent: {
        type: Number, // 1 2 3 4 7 8 9 10 11 12
      },
      grades: {
        prelim: {
          type: Number,
          default: 0,
        },
        mid: {
          type: Number,
          default: 0,
        },
        prefi: {
          type: Number,
          default: 0,
        },
        final: {
          type: Number,
          default: 0,
        },
      },
      status: {
        type: Number,
        default: 0, // 0 - incomplete, 1 - completed, 2 - dropped
      },
      class: {
        type: Schema.Types.ObjectId,
        ref: "classes",
      },
      student: {
        type: Schema.Types.ObjectId,
        ref: "students",
      },
      schoolInfo: {
        type: Schema.Types.ObjectId,
        ref: "schoolInfos",
      },
    },
    { timestamps: true }
  );

  const StudentSubjects = model("studentSubjects", schema);

  return StudentSubjects;
};

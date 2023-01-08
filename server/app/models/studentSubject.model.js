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
      subjectType: {
        type: Number,
      },
      studentType: {
        type: Number, //1 - college, 2 - senior high, 3 - junior high
      },
      yearLevelOfStudent: {
        type: Number, // 1 2 3 4 7 8 9 10 11 12
      },
      grades: {
        prelim: {
          quiz: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          activity: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          performance: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          exam: {
            achieved: Number,
            total: Number,
          },
        },
        mid: {
          quiz: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          activity: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          performance: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          exam: {
            achieved: Number,
            total: Number,
          },
        },
        prefi: {
          quiz: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          activity: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          performance: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          exam: {
            achieved: Number,
            total: Number,
          },
        },
        final: {
          quiz: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          activity: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          performance: [
            {
              achieved: Number,
              total: Number,
            },
          ],
          exam: {
            achieved: Number,
            total: Number,
          },
        },
      },
      dropped: {
        type: Boolean,
        default: false,
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

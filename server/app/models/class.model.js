module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      subjectCode: {
        type: String,
        required: true,
      },
      instructor: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "students",
        },
      ],
      studentType: Number, //1 - college 2 - Senior 3 - Junior
      schoolInfo: {
        type: Schema.Types.ObjectId,
        ref: "schoolInfos",
      },
    },
    { timestamps: true }
  );

  const Class = model("classes", schema);

  return Class;
};

module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      text: String,
      isAuto: {
        type: Boolean,
        default: false,
      }, //? if this is auto, then it is create by system
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
    { timestamps: true }
  );

  const History = model("histories", schema);

  return History;
};

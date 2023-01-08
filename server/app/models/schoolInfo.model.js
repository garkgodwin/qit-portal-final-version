module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      sy: String, // 21-22
      sem: Number, // 1 or 2
      current: {
        type: Boolean,
        default: false,
      }, // if this is current, then this is the current data being used overall
      locked: {
        type: Boolean,
        default: true,
      }, // if this is false and is current, then users cannot post anything more
      startDate: String, // YYYY-MM-dd
      endDate: String, // YYYY-MM-dd
    },
    { timestamps: true }
  );

  const SchoolInfo = model("schoolInfos", schema);

  return SchoolInfo;
};

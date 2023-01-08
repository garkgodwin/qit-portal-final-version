module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      name: String,
      age: Number,
      birthDate: String,
      gender: Number,
      profileImage: {
        type: String,
        default: "",
      },
      mobileNumber: String,
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      }, // if null or empty means account not created
    },
    { timestamps: true }
  );

  const Person = model("persons", schema);

  return Person;
};

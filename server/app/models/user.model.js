module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      username: {
        type: String,
        unique: true,
      },
      password: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        // unique: true,
      },
      role: Number,
      otp: {
        type: String,
        default: null,
      },
      activated: {
        type: Boolean,
        default: false,
      },
      locked: {
        type: Boolean,
        default: false,
      },
      person: {
        type: Schema.Types.ObjectId,
        ref: "persons",
      },
    },
    { timestamps: true }
  );
  const User = model("users", schema);
  return User;
};

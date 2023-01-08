module.exports = ({ Schema, model }) => {
  const schema = Schema(
    {
      subject: String,
      body: String,
      mobileNumber: String,
      email: String,
      sent: {
        type: Boolean,
        default: false,
      },
      shootDate: {
        type: String,
      },
      sentDate: {
        type: Date,
      },
    },
    { timestamps: true }
  );

  const Notification = model("notifications", schema);

  return Notification;
};

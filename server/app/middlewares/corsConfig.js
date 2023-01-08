var corsOptions = {
  origin: "http://localhost:3000", //TODO: change this to what the client has
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

module.exports = corsOptions;

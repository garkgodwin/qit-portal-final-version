require("dotenv").config();
const ATLAS_URI = process.env.ATLAS_URI;
//TODO: Change the environment from env file when in prodution (to change the collection used);
const env = process.env.ENV;

const SECRET_KEY = process.env.SECRET_KEY;

//TODO: ADD THE env items here
module.exports = {
  ATLAS_URI,
  env,
  SECRET_KEY,
};

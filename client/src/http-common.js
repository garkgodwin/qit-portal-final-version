import axios from "axios";

import { BASE_SERVER_URL } from "./constants";

export default axios.create({
  baseURL: BASE_SERVER_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "*",
  },
});

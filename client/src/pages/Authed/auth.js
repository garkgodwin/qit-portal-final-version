import api from "../http-common";

const ROOT = "/auth";

export const login = async (loginData) => {
  let result = {
    status: 0,
    message: "",
    data: null,
  };
  if (loginData.username === "") {
    return (result = {
      ...result,
      status: 300,
      message: "Please make sure to fill in the username and password fields.",
    });
  } else if (
    loginData.username.length < 4 ||
    (loginData.password !== "" && loginData.password.length < 4)
  ) {
    return (result = {
      ...result,
      status: 300,
      message:
        'Please make sure the character length of username or password is greater than or equal to "4" chracters.',
    });
  } else if (loginData.username.length > 40 || loginData.password.length > 40) {
    return (result = {
      ...result,
      status: 300,
      message:
        'Please make sure the character length of username or password is less than "40" chracters.',
    });
  }
  await api
    .post(ROOT + "/login", loginData)
    .then((res) => {
      const resData = res.data;
      const data = resData.data;
      const message = resData.message;
      const status = res.status;
      result = {
        ...result,
        status: status,
        message: message,
        data: data,
      };
    })
    .catch((error) => {
      const r = error.response;
      if (r) {
        const message = r.data.message;
        const status = r.status;
        result = {
          ...result,
          status: status,
          message: message,
        };
      } else {
        result = {
          ...result,
          status: 500,
          message: "Something went wrong",
        };
      }
    });
  return result;
};

export const authenticate = async (token) => {
  let result = {
    status: 0,
    message: "",
    data: null,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api
    .get(ROOT + "/authenticate", config)
    .then((res) => {
      const resData = res.data;
      const data = resData.data;
      const message = resData.message;
      const status = res.status;
      result = {
        ...result,
        status: status,
        message: message,
        data: data,
      };
    })
    .catch((error) => {
      const { data, status } = error.response;
      const message = data.message;
      result = {
        ...result,
        status: status,
        message: message,
      };
    });
  return result;
};

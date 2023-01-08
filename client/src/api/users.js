import api from "../http-common";

const ROOT = "/users";

export const getAccounts = async () => {
  let result = {
    status: 0,
    message: "",
    data: null,
  };

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api
    .get(ROOT + "/", config)
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

export const getUserDetailsForFirstSetup = async (userID) => {
  let result = {
    status: 0,
    message: "",
    data: null,
  };
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api
    .get(ROOT + `/${userID}/for-setup`, config)
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
      console.log(error);
      if (error.response !== undefined || error.response !== null) {
        const { data, status } = error.response;
        const message = data.message;
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

export const setFirstSetup = async (userID, data) => {
  let result = {
    status: 0,
    message: "",
    data: null,
  };
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  await api
    .put(ROOT + `/${userID}/for-setup`, data, config)
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

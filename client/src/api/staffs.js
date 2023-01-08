import api from "../http-common";

const ROOT = "/staffs";

export const getAllStaffs = async () => {
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
export const getAllInstructors = async () => {
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
    .get(ROOT + "/instructors", config)
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

export const createStaff = async (data) => {
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
    .post(ROOT + "/", data, config)
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

export const updateStaff = async (personID, data) => {
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
    .put(ROOT + `/${personID}`, data, config)
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

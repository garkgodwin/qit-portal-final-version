import api from "../http-common";

const ROOT = "/school";

export const getAllSchoolInfos = async () => {
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
export const createSchoolInfo = async (data) => {
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

export const getSchoolInfoForUpdate = async (schoolInfoID) => {
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
    .get(ROOT + `/${schoolInfoID}/for-update`, config)
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
export const updateSchoolInfo = async (schoolInfoID, data) => {
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
    .put(ROOT + `/${schoolInfoID}/for-update`, data, config)
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

export const lockOrUnlockSchoolInfo = async (schoolInfoID) => {
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
    .put(ROOT + `/${schoolInfoID}/lock-unlock`, {}, config)
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
export const moveSchoolInfo = async (schoolInfoID) => {
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
    .put(ROOT + `/${schoolInfoID}/move`, {}, config)
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

export const getCurrentSchoolInfo = async () => {
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
    .get(ROOT + "/current", config)
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

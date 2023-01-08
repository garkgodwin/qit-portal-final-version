import api from "../http-common";

const ROOT = "/students";

export const getAllStudents = async () => {
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

export const createStudent = async (data) => {
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

export const getStudentForUpdate = async (studentID, data) => {
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
    .get(ROOT + `/${studentID}/details-for-update`, data, config)
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

export const updateStudent = async (studentID, data) => {
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
    .put(ROOT + `/${studentID}`, data, config)
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

export const getStudentAndSubjects = async (studentID) => {
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
    .get(ROOT + `/${studentID}/subjects`, config)
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
export const getGuardiansOfThisStudent = async (studentID) => {
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
    .get(ROOT + `/${studentID}/guardians`, config)
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

export const addGuardianToStudent = async (studentID, data) => {
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
    .post(ROOT + `/${studentID}/guardians`, data, config)
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

export const getSubjectsAvailableForThisStudent = async (studentID) => {
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
    .get(ROOT + `/${studentID}/subjects-available-to-add`, config)
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

export const addSubjectToStudent = async (studentID, data) => {
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
    .post(ROOT + `/${studentID}/new-subject`, data, config)
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

export const dropStudentSubject = async (subjectID) => {
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
    .delete(ROOT + `/drop-subject/${subjectID}`, config)
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

export const createGrade = async (studentID, subjectID, data) => {
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
    .post(ROOT + `/${studentID}/subjects/${subjectID}/new-grade`, data, config)
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

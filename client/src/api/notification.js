import api from "../http-common";

const ROOT = "/notifications";

export const createGradeNotifications = async (data) => {
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
    .post(ROOT + "/grades", { data }, config)
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

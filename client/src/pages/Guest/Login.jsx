import React, { useState } from "react";
//? ROUTER
import { useNavigate } from "react-router-dom";

//? GLOBAL STATE
import { useDispatch } from "react-redux";
import { showToast } from "../../features/toastSlice";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { login as stateLogin } from "../../features/authSlice";

//? API
import { login as apiLogin } from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async () => {
    dispatch(startLoading());
    const result = await apiLogin(inputs);
    console.log(result);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      const data = result.data;
      const user = data.user;
      if (data.type === "first-setup") {
        dispatch(stopLoading());
        navigate(`/first-setup/${user._id}`);
      } else {
        dispatch(
          stateLogin({
            token: result.data.token,
            data: result.data.user,
          })
        );
        dispatch(stopLoading());
        navigate("/");
      }
    }
    dispatch(stopLoading());
  };
  return (
    <div className="page-login">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-title">
          <h3>QIT Login Form</h3>
        </div>
        <div className="form-fields">
          <div className="input-field">
            <label>Username</label>
            <input
              type="text"
              value={inputs.username}
              onChange={(e) => {
                setInputs({
                  ...inputs,
                  username: e.target.value,
                });
              }}
            />
          </div>
          <div className="input-field input-field-password">
            <label>Password</label>
            <input
              type="password"
              value={inputs.password}
              onChange={(e) => {
                setInputs({
                  ...inputs,
                  password: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="form-functions">
          <button
            type="submit"
            className="form-function form-function-login"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

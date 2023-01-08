import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserDetailsForFirstSetup, setFirstSetup } from "../../api/users";
import { showToast } from "../../features/toastSlice";
import { useDispatch } from "react-redux";
import "./FirstSetup.css";

const FirstSetup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  useEffect(() => {
    handleFetchUserDetails();
  }, [location]);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleFetchUserDetails = async () => {
    const userID = location.pathname.split("/")[2];
    const result = await getUserDetailsForFirstSetup(userID);
    if (result.status === 200) {
      const userRes = result.data;
      setUser(userRes);
      setInputs({
        ...inputs,
        username: userRes.username,
      });
    }
  };
  const handleSubmit = async () => {
    const data = {
      user: inputs,
    };
    console.log(data);
    const result = await setFirstSetup(user._id, data);
    console.log(result);
    dispatch(
      showToast({
        body: result.message,
      })
    );
    if (result.status === 200) {
      navigate("/login");
    }
  };
  const handleCancel = () => {
    navigate("/login");
  };

  if (user === null) {
    return (
      <>
        <span>User has already been setup</span>
      </>
    );
  }
  return (
    <div className="first-setup-page">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-title">
          <h3>Setup your account</h3>
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
          <div className="input-field input-field-password">
            <label>Confirm Password</label>
            <input
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) => {
                setInputs({
                  ...inputs,
                  confirmPassword: e.target.value,
                });
              }}
            />
          </div>
          <div className="input-field input-field-password">
            <label>OTP</label>
            <input
              type="text"
              value={inputs.otp}
              onChange={(e) => {
                setInputs({
                  ...inputs,
                  otp: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="form-functions">
          <button
            type="cancel"
            className="form-function form-function-cancel"
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="form-function form-function-activate"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Activate
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirstSetup;

import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../../features/toastSlice";
import "./Toast.css";

const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);
  const handleClose = () => {
    dispatch(hideToast());
  };
  useEffect(() => {
    if (toast.shown) {
      setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
    }
  }, [toast]);
  if (!toast.shown) {
    return null;
  }
  return (
    <div className="Toast">
      <div className="toast-title">Info</div>
      <div className="toast-body">{toast.body}</div>
      <div className="toast-functions">
        <button
          className="toast-function"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default Toast;

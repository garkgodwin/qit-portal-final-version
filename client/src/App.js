import "./App.css";
import React, { useEffect, useState } from "react";

//? ROUTES
import { BrowserRouter, useNavigate } from "react-router-dom";

//? GLOBAL STATE
import { useDispatch, useSelector } from "react-redux";
import { authenticate as stateAuthenticate } from "./features/authSlice";
import { startLoading, stopLoading } from "./features/loadingSlice";

//? API
import { authenticate as apiAuthenticate } from "./api/auth";

//? COMPONENTS
import Navbar from "./components/navbar/Navbar";
import Pages from "./pages/Pages";
import Loading from "./components/loading/ScreenLoading";
import Sidebar from "./components/navbar/Sidebar";
import Toast from "./components/toast/Toast";
import { showToast } from "./features/toastSlice";

function App() {
  const dispatch = useDispatch();
  const [appCls, setAppCls] = useState("App");
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user === null) setAppCls("App");
    else setAppCls("App App-authed");
  }, [auth]);

  useEffect(() => {
    handleAuthenticate();
  }, []);

  const handleAuthenticate = async () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      return;
    }
    if (token) {
      dispatch(startLoading());
      const result = await apiAuthenticate(token);
      dispatch(
        showToast({
          body: result.message,
        })
      );
      if (result.status === 200) {
        dispatch(
          stateAuthenticate({
            data: result.data.user,
          })
        );
      }
      dispatch(stopLoading());
    }
  };
  return (
    <BrowserRouter>
      <Toast />
      <Loading />
      <div className={appCls}>
        {auth.user === null ? <Navbar /> : <Sidebar />}
        <Pages />
      </div>
    </BrowserRouter>
  );
}

export default App;

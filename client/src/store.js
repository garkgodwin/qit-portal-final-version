import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import loadingReducer from "./features/loadingSlice";
import toastReducer from "./features/toastSlice";
import pageReducer from "./features/pageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    toast: toastReducer,
    page: pageReducer,
  },
});

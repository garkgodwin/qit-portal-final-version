import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shown: false,
  body: "",
};

/*
  userTypes
  1- admin
  2- registrar
  3- instructor
  4- student
  5- guardian
*/

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.shown = true;
      const p = action.payload;
      state.body = p.body;
    },
    hideToast: (state) => {
      state.shown = false;
      state.body = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;

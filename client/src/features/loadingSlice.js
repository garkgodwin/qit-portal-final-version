import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shown: false,
};

/*
  userTypes
  1- admin
  2- registrar
  3- instructor
  4- student
  5- guardian
*/

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.shown = true;
    },
    stopLoading: (state) => {
      state.shown = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

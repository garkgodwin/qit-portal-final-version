import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

/*
  userTypes
  1- admin
  2- registrar
  3- instructor
  4- student
  5- guardian
*/

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const p = action.payload;
      localStorage.setItem("token", p.token);
      state.user = p.data;
    },
    authenticate: (state, action) => {
      const p = action.payload;
      state.user = p.data;
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, authenticate, logout } = authSlice.actions;

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  student: null,
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
      state.user = p.data.user;
      if (state.user.role === 4 || state.user.role === 5) {
        state.student = p.data.student;
      }
      localStorage.setItem("token", p.token);
    },
    authenticate: (state, action) => {
      const p = action.payload;
      state.user = p.data.user;
      if (state.user.role === 4 || state.user.role === 5) {
        state.student = p.data.student;
      }
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.student = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, authenticate, logout } = authSlice.actions;

export default authSlice.reducer;

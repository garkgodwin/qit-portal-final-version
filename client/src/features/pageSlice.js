import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: [],
  selectedID: null,
  selectedData: null,
};
export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { startLoading, stopLoading } = pageSlice.actions;

export default pageSlice.reducer;

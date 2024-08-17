import { createSlice } from "@reduxjs/toolkit";

export const toastSlice = createSlice({
  name: "toast",
  initialState: {
    changes: false,
    shake: false,
  },
  reducers: {
    setToastChanges: (state, action) => {
      state.changes = action.payload;
    },
    shakeToast: (state, action) => {
      state.shake = action.payload;
    },
  },
});

export const { setToastChanges, shakeToast } = toastSlice.actions;
export default toastSlice.reducer;

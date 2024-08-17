import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    changes: false,
  },
  reducers: {
    setSettingsChanges: (state, action) => {
      state.changes = action.payload;
    },
  },
});

export const { setSettingsChanges } = settingsSlice.actions;
export default settingsSlice.reducer;

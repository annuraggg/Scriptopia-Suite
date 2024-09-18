import { createSlice } from "@reduxjs/toolkit";

export const instituteReducer = createSlice({
  name: "institute",
  initialState: {
    _id: null,
    permissions: [""],

    role: null,
    organization: null,
  },
  reducers: {
    setInstitute: (state, action) => {
      state._id = action?.payload?._id;
      state.permissions = action?.payload?.permissions || [""];
      state.role = action?.payload?.role || null;
      state.organization = action?.payload?.organization || null;
    },
  },
});

export const { setInstitute } = instituteReducer.actions;
export default instituteReducer.reducer;

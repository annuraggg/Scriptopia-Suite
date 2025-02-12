import { createSlice } from "@reduxjs/toolkit";

export const instituteSlice = createSlice({
  name: "institute",
  initialState: {
    _id: null,
    permissions: [""], 
    role: null,
    institute: null,
    name: null,
  },
  reducers: {
    setInstitute: (state, action) => {
      state._id = action?.payload?._id;
      state.permissions = action?.payload?.permissions || [""];
      state.role = action?.payload?.role || null;
      state.institute = action?.payload?.institute || null;
      state.name = action?.payload?.name || null;
    },
  },
});

export const { setInstitute } = instituteSlice.actions;
export default instituteSlice.reducer;
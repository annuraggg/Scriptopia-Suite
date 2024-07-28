import { createSlice } from "@reduxjs/toolkit";

export const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    _id: null,
    permissions: [""],
    permissionsObj: [""],
    role: null,
    organization: null,
  },
  reducers: {
    setOrganization: (state, action) => {
      state._id = action?.payload?._id;
      
      state.permissionsObj = action?.payload?.permissions || [""];
      state.role = action?.payload?.role || null;
      state.organization = action?.payload?.organization || null;
    },
  },
});

export const { setOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;

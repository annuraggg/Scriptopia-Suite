import { createSlice } from "@reduxjs/toolkit";

export const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    _id: null,
    permissions: [""],

    role: null,
    organization: null,

    name: null,
  },
  reducers: {
    setOrganization: (state, action) => {
      state._id = action?.payload?._id;
      state.permissions = action?.payload?.permissions || [""];
      state.role = action?.payload?.role || null;
      state.organization = action?.payload?.organization || null;
      state.name = action?.payload?.name || null;
    },
  },
});

export const { setOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;

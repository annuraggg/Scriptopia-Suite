import { createSlice } from "@reduxjs/toolkit";

export const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    _id: "TESTORG", // ! test value. remove once connected to backend
  },
  reducers: {
    setOrganization: (state, action) => {
      state._id = action.payload;
    },
  },
});

export default organizationSlice.reducer;

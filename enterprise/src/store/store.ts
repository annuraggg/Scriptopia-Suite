import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@/reducers/organizationReducer";

export default configureStore({
  reducer: {
    organization: organizationReducer,
  },
});

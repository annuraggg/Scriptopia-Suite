import { configureStore } from "@reduxjs/toolkit";
import organizationReducer from "@/reducers/organizationReducer";
import settingsReducer from "@/reducers/settingsReducer";
import toastReducer from "@/reducers/toastReducer";

export default configureStore({
  reducer: {
    organization: organizationReducer,
    settings: settingsReducer,
    toast: toastReducer,
  },
});

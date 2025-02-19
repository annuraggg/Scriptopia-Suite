import { configureStore } from "@reduxjs/toolkit";
import instituteReducer from "@/reducers/instituteReducer";
import settingsReducer from "@/reducers/settingsReducer";
import toastReducer from "@/reducers/toastReducer";

export default configureStore({
  reducer: {
    institute: instituteReducer,
    settings: settingsReducer,
    toast: toastReducer,
  },
});

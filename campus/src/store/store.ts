import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/reducers/settingsReducer";
import toastReducer from "@/reducers/toastReducer";
import instituteReducer from "@/reducers/instituteReducer";

export default configureStore({
  reducer: {
    institute: instituteReducer,
    settings: settingsReducer,
    toast: toastReducer,
  },
});

import { combineReducers } from "redux";
import instituteReducer from "@/reducers/instituteReducer";
import settingsReducer from "@/reducers/settingsReducer";
import toastReducer from "@/reducers/toastReducer";

const rootReducer = combineReducers({
  institute: instituteReducer,
  settings: settingsReducer,
  toast: toastReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
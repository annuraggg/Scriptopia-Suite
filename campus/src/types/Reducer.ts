import { combineReducers } from "redux";
import organizationReducer from "@/reducers/organizationReducer";
import settingsReducer from "@/reducers/settingsReducer";
import toastReducer from "@/reducers/toastReducer";

const rootReducer = combineReducers({
  organization: organizationReducer,
  settings: settingsReducer,
  toast: toastReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
import { combineReducers } from "redux";
import organizationReducer from "@/reducers/organizationReducer";

const rootReducer = combineReducers({
  organization: organizationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

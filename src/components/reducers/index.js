import serviceReducer from "./ServiceReducer";
import contactReducer from "./ContactReducer";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  service: serviceReducer,
  contact: contactReducer,
});

export default rootReducers;

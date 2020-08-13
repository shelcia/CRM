import serviceReducer from "./ServiceReducer";
import contactReducer from "./ContactReducer";
import LeadReducer from "./LeadReducer";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  service: serviceReducer,
  lead: LeadReducer,
  contact: contactReducer,
});

export default rootReducers;

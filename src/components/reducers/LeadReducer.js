const leadReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_LEAD":
      return action.result;
    case "DEL_LEAD":
      return [...state].filter((lead) => lead._id !== action.id);
    default:
      return state;
  }
};

export default leadReducer;

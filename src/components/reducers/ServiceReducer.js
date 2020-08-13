const serviceReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_SERVICE_REQUEST":
      return action.result;
    case "DEL_SERVICE_REQUEST":
      return [...state].filter((service) => service._id !== action.id);
    default:
      return state;
  }
};

export default serviceReducer;

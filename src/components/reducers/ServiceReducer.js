const serviceReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_SERVICE_REQUEST":
      return action.result;
    default:
      return state;
  }
};

export default serviceReducer;

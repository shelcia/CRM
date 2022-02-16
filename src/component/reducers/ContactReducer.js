const contactReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_CONTACT":
      return action.result;
    case "DEL_CONTACT":
      return [...state].filter((contact) => contact._id !== action.id);
    default:
      return state;
  }
};

export default contactReducer;

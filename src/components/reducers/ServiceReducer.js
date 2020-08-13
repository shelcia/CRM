const serviceReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_SERVICE_REQUEST":
      return action.result;
    //   case "ADD_TODO":
    //     const newTodo = { id: action.id, title: action.title };
    //     return [...state, newTodo];
    //   case "DEL_TODO":
    //     return [...state].filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
};

export default serviceReducer;

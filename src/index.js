import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import rootReducers from "./components/reducers";
// import { createStore } from "redux";
// import { Provider } from "react-redux";

// const store = createStore(
//   rootReducers,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

ReactDOM.render(
  // <Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </Provider>
  document.getElementById("root")
);

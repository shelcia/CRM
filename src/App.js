import React, { useState } from "react";
import axios from "axios";
import "./styles/style.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState();

  const loginUser = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = { email: email, password: password };
    console.log(JSON.stringify(response));
    try {
      const result = await axios.post(
        "http://localhost:3000/api/users/login",
        response
      );
      console.log(result);
      console.log(result.data);
      setToken(result.data);
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
    }
  };
  return (
    <React.Fragment>
      <div className="login-container">
        <h5>Login</h5>
        <input
          type="text"
          placeholder="enter email-id"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={(e) => loginUser(e)}>
          Login
        </button>
      </div>
    </React.Fragment>
  );
};

export default App;

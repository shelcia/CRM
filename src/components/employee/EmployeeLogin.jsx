import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState("hide");
  const [message, setMessage] = useState("");

  const history = useHistory();

  const classname =
    display === "show" ? "badge-container show" : "badge-container hide";

  const loginUser = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = { email: email, password: password };
    try {
      const result = await axios.post(
        "http://localhost:3000/api/employee/login",
        response
      );
      localStorage.setItem("token", result.data);
      setDisplay("show");
      setMessage("successfull login");
      history.push("/employeedashboard/servicerequest");
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
      setDisplay("show");
      setMessage(e);
    }
  };
  return (
    <React.Fragment>
      <div className={classname}>{message.toString()}</div>
      <div className="login-container">
        <h5>Employee Login</h5>
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
        <Link to="/managerlogin">Go to Manager Login Page</Link>
        <Link to="/adminlogin">Go to Admin Login Page</Link>
      </div>
    </React.Fragment>
  );
};

export default EmployeeLogin;

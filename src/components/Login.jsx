import React, { useState } from "react";
import axios from "axios";

//EMPLOYEE LOGIN

const EmployeeLogin = ({ setToken, setView, setIsLogged, setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState("hide");
  const [message, setMessage] = useState("");
  const loginUser = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = { email: email, password: password };
    console.log(JSON.stringify(response));
    try {
      const result = await axios.post(
        "http://localhost:3000/api/employee/login",
        response
      );
      console.log(result);
      console.log(result.data);
      setToken(result.data);
      setDisplay("show");
      setMessage("successfull login");
      setIsLogged("true");
      setType("employee");
      localStorage.setItem("user_name", email);
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
      setDisplay("show");
      setMessage(e);
    }
  };
  const classname =
    display === "show" ? "badge-container show" : "badge-container hide";
  return (
    <React.Fragment>
      <div className={classname}>{message.toString()}</div>
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
        <p onClick={() => setView("admin")}>Go to Admin Login Page</p>
        <p onClick={() => setView("manager")}>Go to Manager Login Page</p>
      </div>
    </React.Fragment>
  );
};

//ADMIN LOGIN

const AdminLogin = ({ setToken, setView, setIsLogged, setType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState("hide");
  const [message, setMessage] = useState("");
  const classname =
    display === "show" ? "badge-container show" : "badge-container hide";

  const loginUser = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = { email: email, password: password };
    console.log(JSON.stringify(response));
    try {
      const result = await axios.post(
        "http://localhost:3000/api/admin/login",
        response
      );
      console.log(result);
      console.log("admin" + result.data);
      setToken(result.data);
      setDisplay("show");
      setMessage("successfull login");
      setIsLogged("true");
      setType("admin");
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
        <p onClick={() => setView("employee")}>Go to Employee Login Page</p>
        <p onClick={() => setView("manager")}>Go to Manager Login Page</p>
      </div>
    </React.Fragment>
  );
};

//MANAGER LOGIN

const ManagerLogin = ({ setToken, setView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginUser = async (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = { email: email, password: password };
    console.log(JSON.stringify(response));
    try {
      const result = await axios.post(
        "http://localhost:3000/api/manager/login",
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
        <p onClick={() => setView("admin")}>Go to Admin Login Page</p>
        <p onClick={() => setView("employee")}>Go to Employee Login Page</p>
      </div>
    </React.Fragment>
  );
};
const Login = ({ setToken, setIsLogged, setType }) => {
  const [view, setView] = useState("employee");

  return (
    <React.Fragment>
      {view === "employee" && (
        <EmployeeLogin
          setView={setView}
          setToken={setToken}
          setIsLogged={setIsLogged}
          setType={setType}
        />
      )}
      {view === "manager" && (
        <ManagerLogin
          setView={setView}
          setToken={setToken}
          setIsLogged={setIsLogged}
          setType={setType}
        />
      )}
      {view === "admin" && (
        <AdminLogin
          setView={setView}
          setToken={setToken}
          setIsLogged={setIsLogged}
          setType={setType}
        />
      )}
    </React.Fragment>
  );
};

export default Login;

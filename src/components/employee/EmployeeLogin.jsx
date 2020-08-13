import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Illustration from "../../assets/illustration.png";

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
        "https://crm-backend-nodejs.herokuapp.com/api/employee/login",
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
        <div className="flexbox">
          <div className="illustrator">
            <img src={Illustration} alt="illustration" />
          </div>
          <div className="login">
            <div className="headliner">Employee Signin</div>
            <input
              type="text"
              placeholder="enter email-id"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={(e) => loginUser(e)}>
              Login
            </button>
            {/* <Link to="/employeelogin">Go to Employee Login Page</Link>
            <Link to="/managerlogin">Go to Manager Login Page</Link> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmployeeLogin;

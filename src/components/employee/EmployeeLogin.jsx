import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Illustration from "../../assets/illustration.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

  const url = `https://crm-backend-nodejs.herokuapp.com/api/employee/login`;

  const ErrorNotify = (message) => toast.error(message);

  const loginUser = async (event) => {
    setLoading(true);
    event.preventDefault();
    const response = { email: email, password: password };
    axios({
      url: url,
      method: "POST",
      data: response,
    })
      .then((response) => {
        // console.log(response);
        setLoading(false);
        if (response.data.message) {
          ErrorNotify(response.data.message);
        } else {
          setLoading(false);
          localStorage.setItem("token", response.data);
          history.push("/employeedashboard/servicerequest");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        ErrorNotify("Incorrect Credentials");
      });
  };
  return (
    <React.Fragment>
      <ToastContainer />
      {isLoading && (
        <div className="loading">
          <Loader type="Audio" color="#897eff" height={100} width={100} />
          <p>Please wait while we verify....</p>
        </div>
      )}
      {!isLoading && (
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
              <button
                type="button"
                style={{ marginLeft: "2rem" }}
                onClick={(event) => {
                  event.preventDefault();
                  history.push("/#Login");
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default EmployeeLogin;

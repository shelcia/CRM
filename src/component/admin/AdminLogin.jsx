import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ErrorMsg from '../ErrorMsg';

import Illustration from "../../assets/illustration.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

  const url = `https://crm-backend-nodejs.herokuapp.com/api/admin/login`;

  const ErrorNotify = (message) => toast.error(message);

  const loginUser = (event) => {
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
          history.push("/admindashboard/servicerequest");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        ErrorNotify("Incorrect Credentials");
      });
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  const [validEmail, setValidEmail] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const validateAndSetEmail = (v) => {
    if (emailPattern.test(v)) {
      setValidEmail(true);
      setShowEmailError(false);
    } else {
      setValidEmail(false);
      setShowEmailError(true);
    }
    setEmail(v);
  };

  const validateAndSetPassword = (v) => {
    if (v.length < 1) {
      setValidPassword(false);
      setShowPasswordError(true);
    } else {
      setValidPassword(true);
      setShowPasswordError(false);
    }
    setPassword(v);
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
              <div className="headliner">Admin Signin</div>
              <input
                type="text"
                placeholder="enter email-id"
                onChange={(e) => validateAndSetEmail(e.target.value)}
              />
              <ErrorMsg show={showEmailError} msg={'Invalid e-mail!'} />
              <input
                type="password"
                placeholder="enter password"
                onChange={(e) => validateAndSetPassword(e.target.value)}
              />
              <ErrorMsg show={showPasswordError} msg={'Empty password!'} />
              <button type="button" onClick={(e) => loginUser(e)} disabled={!validEmail || !validPassword}>
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

export default AdminLogin;

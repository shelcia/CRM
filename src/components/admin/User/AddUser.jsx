import React, { useState } from "react";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const token = localStorage.getItem("token");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Employee");

  const successNotify = () => toast.success("Succesfully User Added");
  const failedNotify = (message) => toast.error(message);

  const history = useHistory();

  //ADD EMPLOYEE
  const addUser = (e) => {
    e.preventDefault();
    console.log("clicked");
    const response = {
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    };

    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (type === "Employee") {
      const url =
        "https://crm-backend-nodejs.herokuapp.com/api/employee/register";
      axios
        .post(url, response, {
          headers: headers,
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.details[0].message);
          if (data.details[0].message) {
            failedNotify(data.details[0].message);
          } else {
            successNotify();
          }
        })
        .catch((error) => {
          console.log(error);
          failedNotify("Failed to Add User");
        });
    } else if (type === "Manager") {
      const url =
        "https://crm-backend-nodejs.herokuapp.com/api/manager/register";

      axios
        .post(url, response, {
          headers: headers,
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.details[0].message);
          if (data.details[0].message) {
            failedNotify(data.details[0].message);
          } else {
            successNotify();
          }
        })
        .catch((error) => {
          console.log(error);
          failedNotify("Failed to Add User");
        });
    } else if (type === "Admin") {
      const url = "https://crm-backend-nodejs.herokuapp.com/api/admin/register";
      axios
        .post(url, response, {
          headers: headers,
        })
        .then((response) => {
          response.json();
          if (response.status === 200) {
            successNotify();
          } else if (response.status === 400) {
            failedNotify("Please fill out all the fields");
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          failedNotify("Failed to Add User");
        });
    }
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Add User</div>
          </div>
          <hr />
          <div className="content">
            <div className="add-form">
              <input
                type="text"
                name="fname"
                value={fname}
                placeholder="First Name"
                onChange={(e) => setFname(e.target.value)}
              />
              <input
                type="text"
                name="lname"
                value={lname}
                placeholder="Last Name"
                onChange={(e) => setLname(e.target.value)}
              />
              <input
                type="email"
                name="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="pwd"
                alue={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <select
                name="type"
                id="type"
                onChange={(event) => setType(event.target.value)}
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="button-container">
                <button onClick={(e) => addUser(e)}>Add User</button>
                <button type="button" onClick={() => history.goBack()}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddUser;

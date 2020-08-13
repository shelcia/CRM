import React, { useState } from "react";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";

const AddUser = ({ match }) => {
  const token = localStorage.getItem("token");
  console.log(match.params.id);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("Employee");

  const history = useHistory();

  //ADD EMPLOYEE
  const addUser = (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    };

    if (type === "Employee") {
      fetch("https://crm-backend-nodejs.herokuapp.com/api/employee/register", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "Manager") {
      fetch("https://crm-backend-nodejs.herokuapp.com/api/manager/register", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "Admin") {
      fetch("https://crm-backend-nodejs.herokuapp.com/api/admin/register", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(response),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert("created succesfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setFname("");
    setLname("");
    setEmail("");
    setPassword("");
  };

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Contact</div>
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
              <select name="type" id="type">
                <option onSelect={() => setType("Employee")}>Employee</option>
                <option onSelect={() => setType("Manager")}>Manager</option>
                <option onSelect={() => setType("Admin")}>Admin</option>
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

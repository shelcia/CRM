import React, { useState } from "react";
import Sidenav from "./Sidenav";
import { useHistory } from "react-router-dom";

const AddUser = ({ match }) => {
  const token = localStorage.getItem("token");
  console.log(match.params.id);
  const [empfname, setEmpFname] = useState("");
  const [emplname, setEmpLname] = useState("");
  const [empemail, setEmpEmail] = useState("");
  const [emppassword, setEmpPassword] = useState("");
  const [manfname, setManFname] = useState("");
  const [manlname, setManLname] = useState("");
  const [manemail, setManEmail] = useState("");
  const [manpassword, setManPassword] = useState("");
  const [adfname, setAdFname] = useState("");
  const [adlname, setAdLname] = useState("");
  const [ademail, setAdEmail] = useState("");
  const [adpassword, setAdPassword] = useState("");

  const history = useHistory();

  //ADD EMPLOYEE
  const addEmployee = (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      fname: empfname,
      lname: emplname,
      email: empemail,
      password: emppassword,
    };

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
      });
  };

  //ADD MANAGER
  const addManager = (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      fname: manfname,
      lname: manlname,
      email: manemail,
      password: manpassword,
    };

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
      });
  };

  //ADD ADMIN
  const addAdmin = (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      fname: adfname,
      lname: adlname,
      email: ademail,
      password: adpassword,
    };

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
        alert(data);
      });
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="navbar-container">
          <Sidenav />
        </div>
        <div className="card-container">
          <div className="add-form">
            <h3>Add Employee</h3>
            <input
              type="text"
              name="fname"
              placeholder="first name"
              onChange={(e) => setEmpFname(e.target.value)}
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              onChange={(e) => setEmpLname(e.target.value)}
            />
            <input
              type="text"
              name="email"
              placeholder="email"
              onChange={(e) => setEmpEmail(e.target.value)}
            />
            <input
              type="password"
              name="pwd"
              placeholder="password"
              onChange={(e) => setEmpPassword(e.target.value)}
            />
            <button onClick={(e) => addEmployee(e)}>Add Employee</button>
            <button
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
          </div>
          {/* MANAGER */}
          <div className="add-form">
            <h3>Add Manager</h3>
            <input
              type="text"
              name="fname"
              placeholder="first name"
              onChange={(e) => setManFname(e.target.value)}
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              onChange={(e) => setManLname(e.target.value)}
            />
            <input
              type="text"
              name="email"
              placeholder="email"
              onChange={(e) => setManEmail(e.target.value)}
            />
            <input
              type="password"
              name="pwd"
              placeholder="password"
              onChange={(e) => setManPassword(e.target.value)}
            />
            <button onClick={(e) => addManager(e)}>Add Manager</button>
            <button
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
          </div>
          {/* Admin */}
          <div className="add-form">
            <h3>Add Admin</h3>
            <input
              type="text"
              name="fname"
              placeholder="first name"
              onChange={(e) => setAdFname(e.target.value)}
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              onChange={(e) => setAdLname(e.target.value)}
            />
            <input
              type="text"
              name="email"
              placeholder="email"
              onChange={(e) => setAdEmail(e.target.value)}
            />
            <input
              type="password"
              name="pwd"
              placeholder="password"
              onChange={(e) => setAdPassword(e.target.value)}
            />
            <button onClick={(e) => addAdmin(e)}>Add Admin</button>
            <button
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddUser;

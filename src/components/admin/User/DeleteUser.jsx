import React, { useState } from "react";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";

const DelUser = () => {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const history = useHistory();

  const delUser = () => {
    console.log("delete");
    const response = {
      email: email,
    };
    console.log(response);
    fetch("https://crm-backend-nodejs.herokuapp.com/api/admin/deleteuser", {
      method: "DELETE",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data);
      });
    window.location.reload();
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="navbar-container">
          <Sidenav />
        </div>
        <div className="card-container">
          <div className="add-form">
            <h3>Delete User</h3>
            <input
              type="text"
              name="email"
              placeholder="enter email id to delete to user "
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={(e) => delUser(e)}>Delete User</button>
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

export default DelUser;

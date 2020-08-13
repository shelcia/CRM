import React, { useState } from "react";
import Sidenav from "../Sidenav";

const AddForm = () => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState();
  const [status, setStatus] = useState("New");
  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead";
  const addServiceRequest = (e) => {
    const token = localStorage.getItem("token");
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      title: title,
      client: client,
      number: number,
      status: status,
    };
    console.log(JSON.stringify(response));

    fetch(url, {
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
        // console.log(data);
        if (data.status === 400) {
          alert("error in the input field");
        } else {
          alert("successfully added");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    alert("successfully added");
  };
  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Lead</div>
          </div>
          <hr />
          <div className="content">
            <div className="add-form">
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                name="client"
                placeholder="Client"
                onChange={(e) => setClient(e.target.value)}
              />
              <input
                type="number"
                name="numberr"
                placeholder="Number"
                onChange={(e) => setNumber(e.target.value)}
              />

              <select name="status" id="status">
                <option onSelect={() => setStatus("New")}>New</option>
                <option onSelect={() => setStatus("Lost")}>Lost</option>
                <option onSelect={() => setStatus("Contacted")}>
                  Contacted
                </option>
                <option onSelect={() => setStatus("Qualified")}>
                  Qualified
                </option>
                <option onSelect={() => setStatus("Cancelled")}>
                  Cancelled
                </option>
                <option onSelect={() => setStatus("Confirmed")}>
                  Confirmed
                </option>
              </select>

              <div className="button-container">
                <button onClick={(e) => addServiceRequest(e)}>Add Lead</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddForm;

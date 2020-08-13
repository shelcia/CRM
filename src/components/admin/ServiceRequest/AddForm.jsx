import React, { useState } from "react";
import Sidenav from "../Sidenav";

const AddForm = () => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [closing, setClosing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [prob, setProb] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest";
  const addServiceRequest = (e) => {
    const token = localStorage.getItem("token");
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      title: title,
      client: client,
      manager: manager,
      expected_revenue: revenue,
      probability: prob,
      status: status,
      expected_closing: closing,
      priority: priority,
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
        console.log(data);
        if (data.status === 400) {
          alert("error in the input field");
        } else {
          alert("successfully added");
        }
      })
      .catch((err) => {
        alert(err);
      });
    // getServiceRequest();
  };
  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Service Request</div>
          </div>
          <hr />
          <div className="content">
            <div className="add-form">
              <input
                type="text"
                name="title"
                placeholder="title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                name="client"
                placeholder="client"
                onChange={(e) => setClient(e.target.value)}
              />
              <input
                type="text"
                name="manager"
                placeholder="manager"
                onChange={(e) => setManager(e.target.value)}
              />
              <input
                type="date"
                name="closing"
                placeholder="closing"
                onChange={(e) => setClosing(e.target.value)}
              />
              <input
                type="text"
                name="priority"
                placeholder="priority"
                onChange={(e) => setPriority(e.target.value)}
              />
              <input
                type="text"
                name="status"
                placeholder="status"
                onChange={(e) => setStatus(e.target.value)}
              />
              <input
                type="text"
                name="probability"
                placeholder="probability"
                onChange={(e) => setProb(e.target.value)}
              />
              <input
                type="text"
                name="revenue"
                placeholder="revenue"
                onChange={(e) => setRevenue(e.target.value)}
              />
              <button onClick={(e) => addServiceRequest(e)}>
                Add Service Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddForm;

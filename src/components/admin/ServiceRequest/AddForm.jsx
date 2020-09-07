import React, { useState } from "react";
import Sidenav from "../Sidenav";
// import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddForm = () => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [closing, setClosing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [prob, setProb] = useState("");
  const [priority, setPriority] = useState("High");
  const [status, setStatus] = useState("Created");

  const successNotify = () => toast.success("Succesfully Added");
  const failedNotify = (message) => toast.error(message);

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest";

  const addServiceRequest = (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
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
    fetch(url, {
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((response) => {
        response.json();
        console.log(response.status);
        if (response.status === 200) {
          successNotify();
        } else if (response.status === 400) {
          failedNotify("Please fill out all the fields");
        }
      })
      .then((data) => console.log(data))
      .catch((error) => {
        console.log(error);
      });
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
              <select
                name="status"
                id="status"
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Created">Created</option>
                <option value="Released">Released</option>
                <option value="Open">Open</option>
                <option value="In Process">In process</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                name="priority"
                id="priority"
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="number"
                name="probability"
                placeholder="probability"
                onChange={(e) => setProb(e.target.value)}
              />
              <input
                type="number"
                name="revenue"
                placeholder="revenue"
                onChange={(e) => setRevenue(e.target.value)}
              />
              <div className="button-container">
                <button onClick={(e) => addServiceRequest(e)}>
                  Add Service Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddForm;

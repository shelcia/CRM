import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
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
    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
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
        successNotify();
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
              <select name="status" id="status">
                <option onSelect={() => setStatus("Created")}>Created</option>
                <option onSelect={() => setStatus("Released")}>Released</option>
                <option onSelect={() => setStatus("Open")}>Open</option>
                <option onSelect={() => setStatus("In process")}>
                  In process
                </option>
                <option onSelect={() => setStatus("Cancelled")}>
                  Cancelled
                </option>
                <option onSelect={() => setStatus("Completed")}>
                  Completed
                </option>
              </select>
              <select name="priority" id="priority">
                <option onSelect={() => setPriority("High")}>High</option>
                <option onSelect={() => setPriority("Medium")}>Medium</option>
                <option onSelect={() => setPriority("Low")}>Low</option>
              </select>
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

import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddForm = () => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState();
  const [status, setStatus] = useState("New");

  const successNotify = () => toast.success("Succesfully Added");
  const failedNotify = (message) => toast.error(message);

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/lead";
  const addServiceRequest = (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    const response = {
      title: title,
      client: client,
      number: number,
      status: status,
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
                name="number"
                placeholder="Number"
                onChange={(e) => setNumber(e.target.value)}
              />

              <select
                name="status"
                id="status"
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
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

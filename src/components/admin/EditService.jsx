import React, { useState } from "react";
import Sidenav from "./Sidenav";
import axios from "axios";
import { useHistory } from "react-router-dom";

const EditService = ({ match }) => {
  console.log(match.params.id);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [closing, setClosing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [prob, setProb] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const history = useHistory();

  const editServiceRequest = (e) => {
    console.log("put");
    e.preventDefault();
    const response = {
      _id: match.params.id,
      title: title,
      client: client,
      manager: manager,
      closing: closing,
      revenue: revenue,
      prob: prob,
      priority: priority,
      status: status,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest/${match.params.id}`,
        response
      )
      .then((res) => console.log(res.data));
    alert("successfully edited");
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="navbar-container">
          <Sidenav />
        </div>
        <div className="card-container">
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
            <button onClick={(e) => editServiceRequest(e)}>
              Edit Service Request
            </button>
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

export default EditService;

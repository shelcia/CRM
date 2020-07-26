import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidenav from "./Sidenav";

const ServiceRequest = () => {
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [closing, setClosing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [prob, setProb] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getServiceRequest();
  }, []);

  const getServiceRequest = async () => {
    const token = localStorage.getItem("token");
    axios({
      url:
        "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/servicerequest",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        alert("successfull");
        setResults(response.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

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

    fetch(
      "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/servicerequest",
      {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(response),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("added succuessfully");
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
          {results.map((result) => (
            <div key={result._id} className="cards">
              <ul>
                <li>{result.title}</li>
                <li>{result.client}</li>
                <li>{result.manager}</li>
                <li>{result.expected_closing}</li>
                <li>{result.priority}</li>
                <li>{result.status}</li>
                <li>{result.expected_revenue}</li>
                <li>{result.probability}</li>
                <Link to={`/managerdashboard/servicerequest/${result._id}`}>
                  <i className="material-icons">&#xe3c9;</i>
                </Link>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ServiceRequest;

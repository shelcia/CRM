import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav";

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
        "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

    fetch(
      "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest",
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
        if (status === 400) {
          alert("error in the input field");
        } else {
          alert("successfully added");
        }
      })
      .catch((err) => {
        alert(err);
      });
    getServiceRequest();
  };

  const delServiceRequest = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
    console.log(response);
    fetch(
      "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest",
      {
        method: "DELETE",
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
      });
    getServiceRequest();
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="navbar-container">
          <Sidenav />
        </div>
        <div className="card-container">
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
                <Link to={`/admindashboard/servicerequest/${result._id}`}>
                  <i className="material-icons">&#xe3c9;</i>
                </Link>
                <Link
                  onClick={() => delServiceRequest(result._id)}
                  to="/admindashboard/servicerequest"
                >
                  <i className="material-icons">&#xe872;</i>
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

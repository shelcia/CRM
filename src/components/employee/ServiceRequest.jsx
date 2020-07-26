import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "./Sidenav";

const ServiceRequest = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getServiceRequest();
  }, []);

  const getServiceRequest = async () => {
    const token = localStorage.getItem("token");
    axios({
      url:
        "https://crm-backend-nodejs.herokuapp.com/api/employeedashboard/servicerequest",
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
        alert(err);
      });
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
              </ul>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ServiceRequest;

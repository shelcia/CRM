import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "./Sidenav";

const Lead = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/employeedashboard/lead",
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
                <li>{result.number}</li>
                <li>{result.status}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Lead;

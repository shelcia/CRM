import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "./Sidenav";
import { Link } from "react-router-dom";

const Lead = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/admindashboard/lead",
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
        alert(err);
      });
  };
  const addLead = (e) => {
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

    fetch("http://localhost:3000/api/admindashboard/lead", {
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
        alert(data);
      });

    window.location.reload();
  };
  const delLead = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
    console.log(response);
    fetch("http://localhost:3000/api/admindashboard/lead", {
      method: "DELETE",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data);
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
              type="number"
              name="number"
              placeholder="number"
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type="text"
              name="status"
              placeholder="status"
              onChange={(e) => setStatus(e.target.value)}
            />
            <button onClick={(e) => addLead(e)}>Add Lead</button>
          </div>
          {results.map((result) => (
            <div key={result._id} className="cards">
              <ul>
                <li>{result.title}</li>
                <li>{result.client}</li>
                <li>{result.number}</li>
                <li>{result.status}</li>
                <Link to={`/admindashboard/lead/${result._id}`}>
                  <i className="material-icons">&#xe3c9;</i>
                </Link>
                <Link
                  onClick={() => delLead(result._id)}
                  to="/admindashboard/lead"
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

export default Lead;

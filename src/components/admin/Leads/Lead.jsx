import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadLead } from "../../actions/index";

const Lead = () => {
  // const [results, setResults] = useState([]);
  const results = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    console.log(token);
    axios({
      url: "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        dispatch(LoadLead(response.data));

        // setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  const delLead = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
    console.log(response);
    fetch("https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead", {
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
    getLeads();
  };
  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Lead</div>
            <Link to="/admindashboard/lead/add">
              <button type="button">
                Add <i className="material-icons">&#xe147;</i>
              </button>
            </Link>
          </div>
          <hr />
          <div className="content">
            <ul>
              {results.map((result) => (
                <li key={result._id}>
                  <p>{result.title}</p>
                  <Link to={`/admindashboard/lead/${result._id}`}>
                    <i className="material-icons">&#xe5c8;</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="grid">
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
      </div> */}
    </React.Fragment>
  );
};

export default Lead;

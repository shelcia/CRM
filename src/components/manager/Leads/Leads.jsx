import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DelLead } from "../../actions/index";
import { Link } from "react-router-dom";
import Sidenav from "../Sidenav";

const Lead = ({ match }) => {
  console.log(match.params.id);
  const results = useSelector((state) => state.lead);
  console.log(results);
  const services = results.filter((result) => result._id === match.params.id);
  console.log(services);
  const dispatch = useDispatch();
  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/lead";

  const delLead = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
    console.log(response);
    fetch(url, {
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
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(DelLead(id));
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
            <Link to="/managerdashboard/lead/add">
              <button type="button">
                Add <i className="material-icons">&#xe147;</i>
              </button>
            </Link>
          </div>
          <hr />
          <div className="content">
            {services.map((result) => (
              <div key={result._id} className="cards">
                <ul>
                  <li>
                    <b>Title:</b>
                    <p>{result.title}</p>
                  </li>
                  <li>
                    <b>Client</b>
                    <p>{result.client}</p>
                  </li>
                  <li>
                    <b>number</b>
                    <p>{result.number}</p>
                  </li>
                  <li>
                    <b>Status</b>
                    <p>{result.status}</p>
                  </li>
                </ul>
                <div className="button-container">
                  <Link to={`/managerdashboard/Lead/${result._id}`}>
                    <button type="button">
                      Update
                      <i className="material-icons">&#xe3c9;</i>
                    </button>
                  </Link>
                  <Link
                    onClick={() => delLead(result._id)}
                    to="/managerdashboard/Lead"
                  >
                    <button type="button">
                      Delete
                      <i className="material-icons">&#xe872;</i>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Lead;

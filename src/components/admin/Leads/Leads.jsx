import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DelLead } from "../../actions/index";
import { Link } from "react-router-dom";
import Sidenav from "../Sidenav";
import { useState } from "react";
import EditLead from "./EditLead";
import TitleTemplate from "../templates/TitleTemplate";

const Lead = ({ match }) => {
  const results = useSelector((state) => state.lead);
  const services = results.filter((result) => result._id === match.params.id);
  const dispatch = useDispatch();
  const [view, setView] = useState("noedit");

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead";

  const delLead = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
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
      {view === "noedit" && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <TitleTemplate
              title={`Lead`}
              link={`/admindashboard/lead/add`}
              isAdd={true}
            />
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
                    <button
                      type="button"
                      onClick={() => {
                        setView("edit");
                        localStorage.setItem("key", result._id);
                      }}
                    >
                      Update
                      <i className="material-icons">&#xe3c9;</i>
                    </button>
                    <Link
                      onClick={() => delLead(result._id)}
                      to="/admindashboard/Lead"
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
      )}
      {view === "edit" && <EditLead />}
    </React.Fragment>
  );
};

export default Lead;

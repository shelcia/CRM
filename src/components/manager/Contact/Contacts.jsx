import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidenav from "../Sidenav";
import EditContact from "./EditContact";

const Contacts = ({ match }) => {
  const results = useSelector((state) => state.contact);
  const contacts = results.filter((result) => result._id === match.params.id);

  const [view, setView] = useState("noedit");

  return (
    <React.Fragment>
      {view === "noedit" && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Contact</div>
              <Link to="/managerdashboard/contact/add">
                <button type="button">
                  Add <i className="material-icons">&#xe147;</i>
                </button>
              </Link>
            </div>
            <hr />
            <div className="content">
              {contacts.map((result) => (
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
                      <b>Number</b>
                      <p>{result.number}</p>
                    </li>
                    <li>
                      <b>Email</b>
                      <p>{result.email}</p>
                    </li>
                    <li>
                      <b>Address</b>
                      <p>{result.address}</p>
                    </li>
                  </ul>
                  <div className="button-container">
                    <button type="button" onClick={() => setView("edit")}>
                      Update
                      <i className="material-icons">&#xe3c9;</i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "edit" && (
        <EditContact
          id={match.params.id}
          Title={results.title}
          Client={results.client}
          Email={results.email}
          Address={results.address}
        />
      )}
    </React.Fragment>
  );
};

export default Contacts;

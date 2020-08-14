import React from "react";
import { useSelector } from "react-redux";
import Sidenav from "../Sidenav";

const Contacts = ({ match }) => {
  console.log(match.params.id);
  const results = useSelector((state) => state.contact);
  const contacts = results.filter((result) => result._id === match.params.id);

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Contact</div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contacts;

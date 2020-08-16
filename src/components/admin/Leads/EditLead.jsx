import React, { useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const EditLead = ({ id }) => {
  const results = useSelector((state) => state.service);
  const services = results.filter((result) => result._id === id);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");

  const history = useHistory();

  const editLead = (e) => {
    console.log("put");
    e.preventDefault();
    const response = {
      _id: id,
      title: title,
      client: client,
      number: number,
      status: status,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/lead/${id}`,
        response
      )
      .then((res) => console.log(res.data));
    alert("successfully edited");
  };

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Manager</div>
          </div>
          <hr />
          <div className="content">
            {services.map((result) => (
              <div key={result._id} className="cards">
                <ul>
                  <li>
                    <b>Title:</b>
                    <input
                      type="text"
                      name="title"
                      placeholder="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </li>
                  <li>
                    <b>Client</b>
                    <input
                      type="text"
                      name="client"
                      placeholder="client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    />
                  </li>
                  <li>
                    <b>Manager</b>
                    <input
                      type="text"
                      name="number"
                      placeholder="number"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </li>

                  <li>
                    <b>Status</b>
                    <select name="status" id="status">
                      <option onSelect={() => setStatus("Created")}>
                        Created
                      </option>
                      <option onSelect={() => setStatus("Released")}>
                        Released
                      </option>
                      <option onSelect={() => setStatus("Open")}>Open</option>
                      <option onSelect={() => setStatus("In process")}>
                        In process
                      </option>
                      <option onSelect={() => setStatus("Cancelled")}>
                        Cancelled
                      </option>
                      <option onSelect={() => setStatus("Completed")}>
                        Completed
                      </option>
                    </select>
                  </li>
                </ul>
                <div className="button-container">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      editLead(result._id);
                    }}
                  >
                    Update
                    <i className="material-icons">&#xe872;</i>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      history.push("/managerdashboard/servicerequest")
                    }
                  >
                    Back
                    <i className="material-icons">&#xe3c9;</i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditLead;

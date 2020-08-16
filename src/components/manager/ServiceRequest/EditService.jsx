import React, { useState } from "react";
import Sidenav from "../Sidenav";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";

const EditService = ({ id }) => {
  const results = useSelector((state) => state.service);
  const services = results.filter((result) => result._id === id);
  const [title, setTitle] = useState(services.title);
  const [client, setClient] = useState(services.client);
  const [manager, setManager] = useState(services.manager);
  const [closing, setClosing] = useState(services.closing);
  const [revenue, setRevenue] = useState(services.revenue);
  const [prob, setProb] = useState(services.probability);
  const [priority, setPriority] = useState(services.priority);
  const [status, setStatus] = useState(services.status);
  const history = useHistory();

  const editServiceRequest = () => {
    console.log("put");

    const response = {
      _id: id,
      title: title,
      client: client,
      manager: manager,
      closing: closing,
      revenue: revenue,
      prob: prob,
      priority: priority,
      status: status,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/servicerequest/${id}`,
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
            <div className="title">Contact</div>
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
                      name="manager"
                      placeholder="manager"
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    />
                  </li>
                  <li>
                    <b>Expected Closing</b>
                    <input
                      type="date"
                      name="closing"
                      placeholder="closing"
                      value={closing}
                      onChange={(e) => setClosing(e.target.value)}
                    />
                  </li>
                  <li>
                    <b>Priority</b>
                    <select name="priority" id="priority">
                      <option onSelect={() => setPriority("High")}>High</option>
                      <option onSelect={() => setPriority("Medium")}>
                        Medium
                      </option>
                      <option onSelect={() => setPriority("Low")}>Low</option>
                    </select>
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
                  <li>
                    <b>Expected Revenue</b>
                    <input
                      type="text"
                      name="revenue"
                      placeholder="revenue"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                    />
                  </li>
                  <li>
                    <b>Probability</b>
                    <input
                      type="text"
                      name="probability"
                      placeholder="probability"
                      value={prob}
                      defaultValue="0.4"
                      onChange={(e) => setProb(e.target.value)}
                    />
                  </li>
                </ul>
                <div className="button-container">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      editServiceRequest(result._id);
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

export default EditService;

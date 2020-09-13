import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleTemplate from "../templates/TitleTemplate";
import LoaderTemplate from "../templates/LoaderTemplate";

const EditService = () => {
  const id = localStorage.getItem("key");
  const results = useSelector((state) => state.service);
  const services = results.filter((result) => result._id === id);
  const [title, setTitle] = useState(services[0].title);
  const [client, setClient] = useState(services[0].client);
  const [manager, setManager] = useState(services[0].manager);
  const [closing, setClosing] = useState(services[0].closing);
  const [revenue, setRevenue] = useState(services[0].expected_revenue);
  const [prob, setProb] = useState(services[0].probability);
  const [priority, setPriority] = useState(services[0].priority);
  const [status, setStatus] = useState(services[0].state);

  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  const editServiceRequest = () => {
    setLoading(true);
    const response = {
      _id: id,
      title: title,
      client: client,
      manager: manager,
      expected_revenue: revenue,
      probability: prob,
      status: status,
      expected_closing: closing,
      priority: priority,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest/${id}`,
        response
      )
      .then((res) => {
        successNotify();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        failedNotify();
      });
  };
  return (
    <React.Fragment>
      {loading && (
        <LoaderTemplate
          title={`Service Request`}
          isAdd={true}
          link={`/admindashboard/servicerequest/add`}
          content={`Updating`}
        />
      )}
      {!loading && (
        <React.Fragment>
          <ToastContainer />
          <div className="dashboard">
            <div className="sidebar">
              <Sidenav />
            </div>
            <div className="main-content">
              <TitleTemplate
                title={`Service Request`}
                link={`/admindashboard/servicerequest/add`}
                isAdd={true}
              />
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
                        <select
                          name="priority"
                          id="priority"
                          value={priority}
                          onChange={(event) => setPriority(event.target.value)}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </li>
                      <li>
                        <b>Status</b>
                        <select
                          name="status"
                          id="status"
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                        >
                          <option value="Created">Created</option>
                          <option value="Released">Released</option>
                          <option value="Open">Open</option>
                          <option value="In Process">In process</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </li>
                      <li>
                        <b>Expected Revenue</b>
                        <input
                          type="text"
                          name="revenue"
                          placeholder="Expected revenue"
                          value={revenue}
                          onChange={(e) => setRevenue(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Probability</b>
                        <input
                          type="number"
                          name="probability"
                          placeholder="probability"
                          value={prob}
                          onChange={(e) => setProb(e.target.value)}
                        />
                      </li>
                    </ul>
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          editServiceRequest();
                        }}
                      >
                        Confirm
                        <i className="material-icons">&#xe3c9;</i>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          history.push("/admindashboard/servicerequest");
                          localStorage.removeItem("key");
                        }}
                      >
                        Back
                        <i className="material-icons"> &#xe5c4;</i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default EditService;

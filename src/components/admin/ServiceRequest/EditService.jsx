import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const EditService = ({
  id,
  Title,
  Client,
  Manager,
  Closing,
  Priority,
  Status,
  Revenue,
  Probability,
}) => {
  const [results, setResults] = useState([]);
  const services = results.filter((result) => result._id === id);
  // console.log(services);
  const [title, setTitle] = useState(Title);
  const [client, setClient] = useState(Client);
  const [manager, setManager] = useState(Manager);
  const [closing, setClosing] = useState(Closing);
  const [revenue, setRevenue] = useState(Priority);
  const [prob, setProb] = useState(Status);
  const [priority, setPriority] = useState(Revenue);
  const [status, setStatus] = useState(Probability);
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  // console.log(
  //   id,
  //   Title,
  //   Client,
  //   Manager,
  //   Closing,
  //   Priority,
  //   Status,
  //   Revenue,
  //   Probability
  // );

  useEffect(() => {
    const url =
      "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest";
    const getResult = async () => {
      const token = localStorage.getItem("token");
      axios({
        url: url,
        method: "get",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          setResults(response.data);
          setTitle(response.data.title);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getResult();
  }, []);

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
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest/${id}`,
        response
      )
      .then((res) => {
        console.log(res.data);
        successNotify();
      })
      .catch((error) => {
        console.log(error);
        failedNotify();
      });
  };
  return (
    <React.Fragment>
      {isLoading && (
        <div className="loading">
          <Loader type="Audio" color="#897eff" height={100} width={100} />
          <p>Editing Service Requests...</p>
        </div>
      )}
      {!isLoading && (
        <React.Fragment>
          <ToastContainer />

          <div className="dashboard">
            <div className="sidebar">
              <Sidenav />
            </div>
            <div className="main-content">
              <div className="header">
                <div className="title">Edit Service Request</div>
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
                          <option onClick={() => setPriority("High")}>
                            High
                          </option>
                          <option onClick={() => setPriority("Medium")}>
                            Medium
                          </option>
                          <option onClick={() => setPriority("Low")}>
                            Low
                          </option>
                        </select>
                      </li>
                      <li>
                        <b>Status</b>
                        <select
                          name="status"
                          id="status"
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
                          placeholder=" Expected revenue"
                          onChange={(e) => setRevenue(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Probability</b>
                        <input
                          type="number"
                          name="probability"
                          placeholder="probability"
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
                        <i className="material-icons">&#xe3c9;</i>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          history.push("/admindashboard/servicerequest")
                        }
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

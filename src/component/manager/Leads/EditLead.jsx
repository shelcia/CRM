import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const EditLead = ({ id, Title, Client, Number, Status }) => {
  const [results, setResults] = useState([]);
  // const results = useSelector((state) => state.lead);
  const leads = results.filter((result) => result._id === id);
  const [title, setTitle] = useState(Title);
  const [client, setClient] = useState(Client);
  const [number, setNumber] = useState(Number);
  const [status, setStatus] = useState(Status);

  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const url =
      "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/lead";
    const getResult = async () => {
      const token = localStorage.getItem("token");
      axios({
        url: url,
        method: "get",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        signal: signal,
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
    return () => abortController.abort();
  }, []);

  const editLead = () => {
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
      .then((res) => {
        successNotify();
      })
      .catch((error) => {
        failedNotify();
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Edit Leads</div>
            </div>
            <hr />
            <div className="loading">
              <Loader type="Audio" color="#897eff" height={100} width={100} />
              <p>Editing Leads...</p>
            </div>
          </div>
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
                <div className="title">Edit Leads</div>
              </div>
              <hr />
              <div className="content">
                {leads.map((result) => (
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
                        <select
                          name="status"
                          id="status"
                          onChange={(event) => setStatus(event.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </li>
                    </ul>
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          editLead();
                        }}
                      >
                        Confirm
                        <i className="material-icons">&#xe3c9;</i>
                      </button>
                      <button
                        type="button"
                        onClick={() => history.push("/managerdashboard/lead")}
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

export default EditLead;

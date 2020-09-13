import React, { useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleTemplate from "../templates/TitleTemplate";
import LoaderTemplate from "../templates/LoaderTemplate";

const EditLead = () => {
  const id = localStorage.getItem("key");
  const results = useSelector((state) => state.lead);
  const leads = results.filter((result) => result._id === id);
  const [title, setTitle] = useState(leads[0].title);
  const [client, setClient] = useState(leads[0].client);
  const [number, setNumber] = useState(leads[0].number);
  const [status, setStatus] = useState(leads[0].status);

  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  const editLead = () => {
    setLoading(true);
    const response = {
      _id: id,
      title: title,
      client: client,
      number: number,
      status: status,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead/${id}`,
        response
      )
      .then((res) => {
        successNotify();
        setLoading(false);
      })
      .catch((error) => {
        failedNotify();
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {isLoading && (
        <LoaderTemplate
          title={`Lead`}
          isAdd={true}
          link={`/admindashboard/lead/add`}
          content={`Updating`}
        />
      )}
      {!isLoading && (
        <React.Fragment>
          <ToastContainer />
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
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Status</b>
                        <select
                          name="status"
                          id="status"
                          value={status}
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
                        onClick={() => {
                          history.push("/admindashboard/lead");
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

export default EditLead;

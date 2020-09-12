import React, { useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const EditLead = () => {
  const id = localStorage.getItem("key");
  const results = useSelector((state) => state.contact);
  const contact = results.filter((result) => result._id === id);
  const [title, setTitle] = useState(contact[0].title);
  const [client, setClient] = useState(contact[0].client);
  const [number, setNumber] = useState(contact[0].number);
  const [email, setEmail] = useState(contact[0].email);
  const [address, setAddress] = useState(contact[0].address);

  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  const editContact = () => {
    setLoading(true);
    const response = {
      _id: id,
      title: title,
      client: client,
      number: number,
      email: email,
      address: address,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/contact/${id}`,
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
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Edit Contact</div>
            </div>
            <hr />
            <div className="loading">
              <Loader type="Audio" color="#897eff" height={100} width={100} />
              <p>Editing Contact...</p>
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
                <div className="title">Edit Contact</div>
              </div>
              <hr />
              <div className="content">
                {contact.map((result) => (
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
                        <b>Number</b>
                        <input
                          type="text"
                          name="number"
                          placeholder="number"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </li>

                      <li>
                        <b>Email</b>
                        <input
                          type="text"
                          name="email"
                          placeholder="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Address</b>
                        <input
                          type="text"
                          name="address"
                          placeholder="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </li>
                    </ul>
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          editContact();
                        }}
                      >
                        Confirm
                        <i className="material-icons">&#xe3c9;</i>
                      </button>
                      <button
                        type="button"
                        onClick={() => history.push("/admindashboard/contact")}
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

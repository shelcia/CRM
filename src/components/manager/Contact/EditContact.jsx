import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const EditLead = ({ id, Title, Client, Number, Email, Address }) => {
  const [results, setResults] = useState([]);
  const contact = results.filter((contact) => contact._id === id);
  const [title, setTitle] = useState(Title);
  const [client, setClient] = useState(Client);
  const [number, setNumber] = useState(Number);
  const [email, setEmail] = useState(Email);
  const [address, setAddress] = useState(Address);

  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  const successNotify = () => toast.success("Succesfully Edited");
  const failedNotify = () =>
    toast.error("Oops!..please make sure the input field values are valid");

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const url =
      "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/contact";
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

  const editContact = () => {
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
        `https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/contact/${id}`,
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
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Client</b>
                        <input
                          type="text"
                          name="client"
                          placeholder="client"
                          onChange={(e) => setClient(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Number</b>

                        <input
                          type="text"
                          name="number"
                          placeholder="number"
                          onChange={(e) => setNumber(e.target.value)}
                        />
                      </li>

                      <li>
                        <b>Email</b>

                        <input
                          type="text"
                          name="email"
                          placeholder="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </li>
                      <li>
                        <b>Address</b>
                        <input
                          type="text"
                          name="address"
                          placeholder="address"
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
                        onClick={() =>
                          history.push("/managerdashboard/contact")
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

export default EditLead;

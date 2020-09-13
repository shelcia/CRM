import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DelContact } from "../../actions/index";
import { Link } from "react-router-dom";
import Sidenav from "../Sidenav";
import EditContact from "./EditContact";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contacts = ({ match }) => {
  const results = useSelector((state) => state.contact);
  const contacts = results.filter((result) => result._id === match.params.id);
  const dispatch = useDispatch();

  const [view, setView] = useState("noedit");

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/contact";

  const delContact = (id) => {
    const token = localStorage.getItem("token");
    const response = {
      _id: id,
    };
    fetch(url, {
      method: "DELETE",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        toast.success("Succesfully Deleted");
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(DelContact(id));
  };
  return (
    <React.Fragment>
      {view === "noedit" && (
        <React.Fragment>
          <ToastContainer />
          <div className="dashboard">
            <div className="sidebar">
              <Sidenav />
            </div>
            <div className="main-content">
              <div className="header">
                <div className="title">Contact</div>
                <Link to="/admindashboard/contact/add">
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
                      <button
                        type="button"
                        onClick={() => {
                          setView("edit");
                          localStorage.setItem("key", result._id);
                        }}
                      >
                        Update
                        <i className="material-icons">&#xe3c9;</i>
                      </button>
                      <Link
                        onClick={() => delContact(result._id)}
                        to="/admindashboard/contact"
                      >
                        <button type="button">
                          Delete
                          <i className="material-icons">&#xe872;</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      {view === "edit" && <EditContact />}
    </React.Fragment>
  );
};

export default Contacts;

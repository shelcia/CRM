import React, { useEffect } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadContact } from "../../actions/index";

const Contact = () => {
  const results = useSelector((state) => state.contact);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getContacts = () => {
      axios({
        url:
          "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/contact",
        method: "get",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          dispatch(LoadContact(response.data));

          // setResults(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getContacts();
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Contact</div>
            <Link to="/managerdashboard/contact/add">
              <button type="button">
                Add <i className="material-icons">&#xe147;</i>
              </button>
            </Link>
          </div>
          <hr />
          <div className="content">
            <ul>
              {results.map((result) => (
                <li key={result._id}>
                  <p>{result.title}</p>
                  <Link to={`/managerdashboard/contact/${result._id}`}>
                    <i className="material-icons">&#xe5c8;</i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;

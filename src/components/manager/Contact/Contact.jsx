import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadContact } from "../../actions/index";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Contact = ({ match }) => {
  const [isLoading, setLoading] = useState(true);

  const results = useSelector((state) => state.contact);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = `https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/contact`;
    const getContacts = () => {
      axios({
        url: url,
        method: "get",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          dispatch(LoadContact(response.data));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getContacts();
  }, [dispatch]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Contacts</div>
              <Link to="/managerdashboard/contact/add">
                <button type="button">
                  Add <i className="material-icons">&#xe147;</i>
                </button>
              </Link>
            </div>
            <hr />
            <div className="loading">
              <Loader type="Audio" color="#897eff" height={100} width={100} />
              <p>Loading Contacts...</p>
            </div>
          </div>
        </div>
      )}
      {!isLoading && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Contacts</div>
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
      )}
    </React.Fragment>
  );
};

export default Contact;

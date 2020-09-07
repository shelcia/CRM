import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadLead } from "../../actions/index";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Lead = () => {
  const [isLoading, setLoading] = useState(true);
  const results = useSelector((state) => state.lead);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const url =
      "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead";
    const getLeads = async () => {
      axios({
        url: url,
        method: "get",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setLoading(false);
          dispatch(LoadLead(response.data));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getLeads();
  }, [dispatch]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="loading">
          <Loader type="Audio" color="#897eff" height={100} width={100} />
          <p>Loading Leads...</p>
        </div>
      )}
      {!isLoading && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <div className="header">
              <div className="title">Lead</div>
              <Link to="/admindashboard/lead/add">
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
                    <Link to={`/admindashboard/lead/${result._id}`}>
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

export default Lead;

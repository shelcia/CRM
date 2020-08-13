import React, { useEffect } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadLead } from "../../actions/index";

const Lead = () => {
  const results = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead";

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    console.log(token);
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
        dispatch(LoadLead(response.data));

        // setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Lead;

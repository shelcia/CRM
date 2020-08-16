import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useSelector, useDispatch } from "react-redux";
import { LoadService } from "../../actions/index";

const ServiceRequest = () => {
  const results = useSelector((state) => state.service);
  const dispatch = useDispatch();

  useEffect(() => {
    const url =
      "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest";
    const getServiceRequest = async () => {
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
          dispatch(LoadService(response.data));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getServiceRequest();
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="dashboard">
        <div className="sidebar">
          <Sidenav />
        </div>
        <div className="main-content">
          <div className="header">
            <div className="title">Service Request</div>
            <Link to="/admindashboard/servicerequest/add">
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
                  <Link to={`/admindashboard/servicerequest/${result._id}`}>
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

export default ServiceRequest;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidenav from "../Sidenav";
import { useSelector, useDispatch } from "react-redux";
import { LoadService } from "../../actions/index";
import LoaderTemplate from "../templates/LoaderTemplate";
import TitleTemplate from "../templates/TitleTemplate";

const ServiceRequest = () => {
  const [isLoading, setLoading] = useState(true);
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
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getServiceRequest();
  }, [dispatch]);

  return (
    <React.Fragment>
      {isLoading && (
        <LoaderTemplate
          title={`Service Request`}
          isAdd={true}
          link={`/admindashboard/servicerequest/add`}
          content={`Loading`}
        />
      )}
      {!isLoading && (
        <div className="dashboard">
          <div className="sidebar">
            <Sidenav />
          </div>
          <div className="main-content">
            <TitleTemplate
              title={`Service Request`}
              link={`/admindashboard/servicerequest/add`}
            />
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
      )}
    </React.Fragment>
  );
};

export default ServiceRequest;

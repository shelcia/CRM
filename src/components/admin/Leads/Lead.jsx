import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadLead } from "../../actions/index";
import LoaderTemplate from "../templates/LoaderTemplate";
import TitleTemplate from "../templates/TitleTemplate";

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
        <LoaderTemplate
          title={`Lead`}
          isAdd={true}
          link={`/admindashboard/lead/add`}
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
              title={`Lead`}
              link={`/admindashboard/lead/add`}
              isAdd={true}
            />
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const ServiceRequest = ({ token }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    getServiceRequest();
  }, []);

  const getServiceRequest = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/employeedashboard/servicerequest",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {results.map((result) => (
        <div key={result._id} className="cards">
          <ul>
            <li>{result.title}</li>
            <li>{result.client}</li>
            <li>{result.manager}</li>
            <li>{result.expected_closing}</li>
            <li>{result.priority}</li>
            <li>{result.status}</li>
            <li>{result.expected_revenue}</li>
            <li>{result.probability}</li>
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};

//LEAD

const Lead = ({ token }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    getLeads();
  }, []);
  const getLeads = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/employeedashboard/lead",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      {results.map((result) => (
        <div key={result._id} className="cards">
          <ul>
            <li>{result.title}</li>
            <li>{result.client}</li>
            <li>{result.number}</li>
            <li>{result.status}</li>
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};

//CONTACT

const Contact = ({ token }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    getContacts();
  }, []);
  const getContacts = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/employeedashboard/contact",
      method: "get",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <React.Fragment>
      {results.map((result) => (
        <div key={result._id} className="cards">
          <ul>
            <li>{result.title}</li>
            <li>{result.client}</li>
            <li>{result.email}</li>
            <li>{result.number}</li>
            <li>{result.address}</li>
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};
const Sidenav = () => {
  return (
    <React.Fragment>
      <nav>
        <ul>
          <Link to="/servicerequest">
            <li>Service Request</li>
          </Link>
          <Link to="/lead">
            <li>Leads</li>
          </Link>
          <Link to="/contact">
            <li>Contacts</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};
const Employee = ({ token }) => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <div className="grid">
            <div className="navbar-container">
              <Sidenav />
            </div>
            <div className="card-container">
              <Route
                path="/"
                exact
                component={() => <ServiceRequest token={token} />}
              />
              <Route
                path="/servicerequest"
                exact
                component={() => <ServiceRequest token={token} />}
              />
              <Route
                path="/lead"
                exact
                component={() => <Lead token={token} />}
              />
              <Route
                path="/contact"
                exact
                component={() => <Contact token={token} />}
              />
            </div>
          </div>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default Employee;

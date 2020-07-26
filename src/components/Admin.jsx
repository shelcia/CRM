import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const ServiceRequest = ({ token }) => {
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [manager, setManager] = useState("");
  const [closing, setClosing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [prob, setProb] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getServiceRequest();
  }, []);

  const getServiceRequest = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/admindashboard/servicerequest",
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
  const addServiceRequest = async (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      title: title,
      client: client,
      manager: manager,
      expected_revenue: revenue,
      probability: prob,
      status: status,
      expected_closing: closing,
      priority: priority,
    };
    console.log(JSON.stringify(response));
    try {
      const result = await axios.post(
        "http://localhost:3000/api/admindashboard/servicerequest",
        response
      );
      console.log(result);
      console.log(result.data);
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
    }
  };

  return (
    <React.Fragment>
      <div className="add-form">
        <input
          type="text"
          name="title"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="client"
          placeholder="client"
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          type="text"
          name="manager"
          placeholder="manager"
          onChange={(e) => setManager(e.target.value)}
        />
        <input
          type="text"
          name="closing"
          placeholder="closing"
          onChange={(e) => setClosing(e.target.value)}
        />
        <input
          type="text"
          name="priority"
          placeholder="priority"
          onChange={(e) => setPriority(e.target.value)}
        />
        <input
          type="text"
          name="status"
          placeholder="status"
          onChange={(e) => setStatus(e.target.value)}
        />
        <input
          type="text"
          name="probability"
          placeholder="probability"
          onChange={(e) => setProb(e.target.value)}
        />
        <input
          type="text"
          name="revenue"
          placeholder="revenue"
          onChange={(e) => setRevenue(e.target.value)}
        />
        <button onClick={(e) => addServiceRequest(e)}>
          Add Service Request
        </button>
      </div>
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
const Lead = ({ token }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    getLeads();
  }, []);
  const getLeads = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/admindashboard/lead",
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
const Contact = ({ token }) => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    getContacts();
  }, []);
  const getContacts = async () => {
    console.log(token);
    axios({
      url: "http://localhost:3000/api/admindashboard/contact",
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
const Employee = ({ token, setIsLogged }) => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <div className="grid">
            <div className="navbar-container">
              <Sidenav setIsLogged={setIsLogged} />
            </div>
            <div className="card-container">
              <Route
                path="/"
                exact
                component={() => <ServiceRequest token={token} />}
              />
              <Route
                path="/servicerequest"
                component={() => <Lead token={token} />}
              />
              <Route path="/lead" component={() => <Lead token={token} />} />
              <Route
                path="/contact"
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

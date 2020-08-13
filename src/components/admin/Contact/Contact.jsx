import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidenav from "../Sidenav";
import { Link } from "react-router-dom";

const Contact = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const url = `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/contact`;

  useEffect(() => {
    getContacts();
  }, []);
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
        console.log(response);
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addContact = (e) => {
    console.log(token);
    e.preventDefault();
    console.log("clicked");
    const response = {
      title: title,
      client: client,
      number: number,
      email: email,
      address: address,
    };
    console.log(JSON.stringify(response));

    fetch(url, {
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(response),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    getContacts();
  };
  const delContact = (id) => {
    const token = localStorage.getItem("token");
    console.log("delete");
    const response = {
      _id: id,
    };
    console.log(response);
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
        console.log(data);
      });
    getContacts();
  };
  return (
    <React.Fragment>
      <div className="grid">
        <div className="navbar-container">
          <Sidenav />
        </div>
        <div className="card-container">
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
              type="number"
              name="number"
              placeholder="number"
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="address"
              placeholder="address"
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={(e) => addContact(e)}>Add Contact</button>
          </div>
          {results.map((result) => (
            <div key={result._id} className="cards">
              <ul>
                <li>{result.title}</li>
                <li>{result.client}</li>
                <li>{result.number}</li>
                <li>{result.email}</li>
                <li>{result.address}</li>
                <Link to={`/admindashboard/contact/${result._id}`}>
                  <i className="material-icons">&#xe3c9;</i>
                </Link>
                <Link
                  onClick={() => delContact(result._id)}
                  to="/admindashboard/contact"
                >
                  <i className="material-icons">&#xe872;</i>
                </Link>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Contact;

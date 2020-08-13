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

  useEffect(() => {
    getContacts();
  }, []);
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

    fetch(
      "https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/contact",
      {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(response),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("added succuessfully");
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
            <button onClick={(e) => addContact(e)}>Add Lead</button>
          </div>
          {results.map((result) => (
            <div key={result._id} className="cards">
              <ul>
                <li>{result.title}</li>
                <li>{result.client}</li>
                <li>{result.number}</li>
                <li>{result.email}</li>
                <li>{result.address}</li>
                <Link to={`/managerdashboard/contact/${result._id}`}>
                  <i className="material-icons">&#xe3c9;</i>
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

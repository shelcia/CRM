import React, { useState } from "react";
import axios from "axios";
import Sidenav from "./Sidenav";
import { useHistory } from "react-router-dom";

const EditLead = ({ match }) => {
  console.log(match.params.id);
  //   const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const history = useHistory();

  const editLead = (e) => {
    console.log("put");
    e.preventDefault();
    const response = {
      _id: match.params.id,
      title: title,
      client: client,
      number: number,
      email: email,
      address: address,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/admindashboard/contact/${match.params.id}`,
        response
      )
      .then((res) => console.log(res.data));
    alert("successfully edited");
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
              type="text"
              name="number"
              placeholder="number"
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type="text"
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
            <button onClick={(e) => editLead(e)}>Edit Contact</button>
            <button
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EditLead;

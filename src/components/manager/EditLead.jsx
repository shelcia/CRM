import React, { useState } from "react";
import axios from "axios";
import Sidenav from "./Sidenav";
import { useHistory } from "react-router-dom";

const EditLead = ({ match }) => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");

  const history = useHistory();

  const editLead = (e) => {
    console.log("put");
    e.preventDefault();
    const response = {
      _id: match.params.id,
      title: title,
      client: client,
      number: number,
      status: status,
    };
    axios
      .put(
        `https://crm-backend-nodejs.herokuapp.com/api/managerdashboard/lead/${match.params.id}`,
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
              name="status"
              placeholder="status"
              onChange={(e) => setStatus(e.target.value)}
            />
            <button onClick={(e) => editLead(e)}>Edit Lead</button>
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

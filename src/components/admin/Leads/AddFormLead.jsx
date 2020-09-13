import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderTemplate from "../templates/LoaderTemplate";
import TitleTemplate from "../templates/TitleTemplate";

const AddForm = () => {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("New");

  const [isloading, setIsLoading] = useState(false);

  const successNotify = () => toast.success("Succesfully Added");
  const failedNotify = (message) => toast.error(message);

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/lead";

  const addServiceRequest = (e) => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    e.preventDefault();

    if (!title || !client || !number) {
      setIsLoading(false);
      failedNotify("Please fill out all the fields");
      return;
    }
    const response = {
      title: title,
      client: client,
      number: number,
      status: status,
    };

    axios({
      url: url,
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
      data: response,
    })
      .then((response) => {
        console.log(response);
        if (response.status === 400) {
          failedNotify("Oops! we are facing some issue try again later");
          setIsLoading(false);
        } else if (response.status === 200) {
          successNotify();
          setIsLoading(false);
          setTitle("");
          setClient("");
          setNumber("");
          setStatus("New");
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  return (
    <React.Fragment>
      {isloading && (
        <LoaderTemplate
          title={`Service Request`}
          isAdd={false}
          link={`/admindashboard/servicerequest/add`}
          content={`Adding`}
        />
      )}
      {!isloading && (
        <React.Fragment>
          <ToastContainer />
          <div className="dashboard">
            <div className="sidebar">
              <Sidenav />
            </div>
            <div className="main-content">
              <TitleTemplate title={`Add Lead`} isAdd={false} />
              <div className="content">
                <div className="add-form">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    name="client"
                    placeholder="Client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                  <input
                    type="number"
                    name="number"
                    placeholder="Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  <select
                    name="status"
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <div className="button-container">
                    <button onClick={(e) => addServiceRequest(e)}>
                      Add Lead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AddForm;

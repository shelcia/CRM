import React, { useState } from "react";
import Sidenav from "../Sidenav";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderTemplate from "../templates/LoaderTemplate";
import TitleTemplate from "../templates/TitleTemplate";

const AddForm = () => {
  const [title, setTitle] = useState();
  const [client, setClient] = useState();
  const [manager, setManager] = useState();
  const [closing, setClosing] = useState();
  const [revenue, setRevenue] = useState();
  const [prob, setProb] = useState();
  const [priority, setPriority] = useState("High");
  const [status, setStatus] = useState("Created");

  const [isloading, setIsLoading] = useState(false);

  const successNotify = () => toast.success("Succesfully Added");
  const failedNotify = (message) => toast.error(message);

  const url =
    "https://crm-backend-nodejs.herokuapp.com/api/admindashboard/servicerequest";

  const addServiceRequest = (e) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    e.preventDefault();
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
    console.log(response);
    if (
      !title ||
      !client ||
      !manager ||
      !closing ||
      !revenue ||
      !prob ||
      !priority ||
      !status
    ) {
      failedNotify("Please fill out all the fields");
      setIsLoading(false);
      return;
    }
    if (isNaN(revenue) || isNaN(prob)) {
      failedNotify("Revenue and Probability needs to be a number");
      setIsLoading(false);
      return;
    }

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
              <TitleTemplate
                title={`Service Request`}
                link={`/admindashboard/servicerequest/add`}
                isAdd={false}
              />
              <div className="content">
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
                    type="date"
                    name="closing"
                    placeholder="closing"
                    onChange={(e) => setClosing(e.target.value)}
                  />
                  <select
                    name="status"
                    id="status"
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="Created">Created</option>
                    <option value="Released">Released</option>
                    <option value="Open">Open</option>
                    <option value="In Process">In process</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    name="priority"
                    id="priority"
                    onChange={(event) => setPriority(event.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <input
                    type="number"
                    name="probability"
                    placeholder="probability"
                    onChange={(e) => setProb(e.target.value)}
                  />
                  <input
                    type="number"
                    name="revenue"
                    placeholder="revenue"
                    onChange={(e) => setRevenue(e.target.value)}
                  />
                  <div className="button-container">
                    <button onClick={(e) => addServiceRequest(e)}>
                      Add Service Request
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

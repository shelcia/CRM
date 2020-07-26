import React from "react";
import Employee from "./Employee";
import Admin from "./Admin";
import Manager from "./Manager";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const Dashboard = ({ type, token }) => {
  return (
    <React.Fragment>
      {type === "employee" && <Employee token={token} />}
      {type === "admin" && <Admin token={token} />}
      {type === "manager" && <Manager />}
    </React.Fragment>
  );
};

export default Dashboard;

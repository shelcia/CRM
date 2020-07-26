import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//ADMIN ROUTES
import AdminLogin from "./components/admin/AdminLogin";
import AdminServiceRequest from "./components/admin/ServiceRequest";
import AdminLead from "./components/admin/Lead";
import AdminContact from "./components/admin/Contact";
import AdminEditServiceRequest from "./components/admin/EditService";
import AdminEditLead from "./components/admin/EditLead";
import AdminEditContact from "./components/admin/EditContact";
//MANAGER ROUTES
import ManagerLogin from "./components/manager/ManagerLogin";
import ManagerServiceRequest from "./components/manager/ServiceRequest";
// import ManagerLogin from "./components/manager/ManagerLogin";

import "./styles/style.css";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/" exact component={() => <AdminLogin />} />
          <Route path="/adminlogin" exact component={() => <AdminLogin />} />
          <Route
            path="/admindashboard/servicerequest"
            exact
            component={() => <AdminServiceRequest />}
          />
          <Route
            path="/admindashboard/servicerequest/:id"
            component={AdminEditServiceRequest}
          />
          <Route
            path="/admindashboard/lead"
            exact
            component={() => <AdminLead />}
          />
          <Route path="/admindashboard/lead/:id" component={AdminEditLead} />
          <Route
            path="/admindashboard/contact"
            exact
            component={() => <AdminContact />}
          />
          <Route
            path="/admindashboard/contact/:id"
            component={AdminEditContact}
          />
          <Route
            path="/managerlogin"
            exact
            component={() => <ManagerLogin />}
          />
          <Route
            path="/manangerdashboard/servicerequest"
            exact
            component={() => <ManagerServiceRequest />}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;

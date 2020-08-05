import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//ROUTES
import LandingPage from "./components/LandingPage";

//ADMIN ROUTES
import AdminLogin from "./components/admin/AdminLogin";
import AdminServiceRequest from "./components/admin/ServiceRequest";
import AdminLead from "./components/admin/Lead";
import AdminContact from "./components/admin/Contact";
import AdminEditServiceRequest from "./components/admin/EditService";
import AdminEditLead from "./components/admin/EditLead";
import AdminEditContact from "./components/admin/EditContact";
import AdminAddUser from "./components/admin/AddUser";
import AdminDelUser from "./components/admin/DeleteUser";
//MANAGER ROUTES
import ManagerLogin from "./components/manager/ManagerLogin";
import ManagerServiceRequest from "./components/manager/ServiceRequest";
import ManagerLead from "./components/manager/Lead";
import ManagerContact from "./components/manager/Contact";
import ManagerEditServiceRequest from "./components/manager/EditService";
import ManagerEditLead from "./components/manager/EditLead";
import ManagerEditContact from "./components/manager/EditContact";
//EMPLOYEE ROUTES
import EmployeeLogin from "./components/employee/EmployeeLogin";
import EmployeeServiceRequest from "./components/employee/ServiceRequest";
import EmployeeLead from "./components/employee/Lead";
import EmployeeContact from "./components/employee/Contact";

import "./styles/style.css";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/" exact component={() => <LandingPage />} />
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
          <Route path="/admindashboard/adduser" component={AdminAddUser} />
          <Route path="/admindashboard/deleteuser" component={AdminDelUser} />

          <Route
            path="/managerlogin"
            exact
            component={() => <ManagerLogin />}
          />
          <Route
            path="/managerdashboard/servicerequest"
            exact
            component={() => <ManagerServiceRequest />}
          />
          <Route
            path="/managerdashboard/servicerequest/:id"
            component={ManagerEditServiceRequest}
          />
          <Route
            path="/managerdashboard/lead"
            exact
            component={() => <ManagerLead />}
          />
          <Route
            path="/managerdashboard/lead/:id"
            component={ManagerEditLead}
          />
          <Route
            path="/managerdashboard/contact"
            exact
            component={() => <ManagerContact />}
          />
          <Route
            path="/managerdashboard/contact/:id"
            component={ManagerEditContact}
          />
          <Route
            path="/employeelogin"
            exact
            component={() => <EmployeeLogin />}
          />
          <Route
            path="/employeedashboard/servicerequest"
            exact
            component={() => <EmployeeServiceRequest />}
          />
          <Route
            path="/employeedashboard/lead"
            exact
            component={() => <EmployeeLead />}
          />
          <Route
            path="/employeedashboard/contact"
            exact
            component={() => <EmployeeContact />}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;

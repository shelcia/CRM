import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//ROUTES
import LandingPage from "./components/LandingPage";

//ADMIN ROUTES
import AdminLogin from "./components/admin/AdminLogin";

import AdminServiceRequest from "./components/admin/ServiceRequest/ServiceRequest";
import AdminService from "./components/admin/ServiceRequest/Service";
import AdminAddServiceRequest from "./components/admin/ServiceRequest/AddForm";
// import AdminEditServiceRequest from "./components/admin/ServiceRequest/EditService";

import AdminLeads from "./components/admin/Leads/Leads";
import AdminLead from "./components/admin/Leads/Lead";
import AdminAddLead from "./components/admin/Leads/AddFormLead";
// import AdminEditLead from "./components/admin/Leads/EditLead";

import AdminContact from "./components/admin/Contact/Contact";
import AdminContacts from "./components/admin/Contact/Contacts";
import AdminAddContact from "./components/admin/Contact/AddForm";
// import AdminEditContact from "./components/admin/Contact/EditContact";

import AdminAddUser from "./components/admin/User/AddUser";
import AdminDelUser from "./components/admin/User/DeleteUser";
import AdminAllUsers from "./components/admin/User/AllUser";
//MANAGER ROUTES
import ManagerLogin from "./components/manager/ManagerLogin";

import ManagerServiceRequest from "./components/manager/ServiceRequest/ServiceRequest";
import ManagerEditServiceRequest from "./components/manager/ServiceRequest/EditService";

import ManagerLead from "./components/manager/Leads/Lead";
import ManagerEditLead from "./components/manager/Leads/EditLead";

import ManagerContact from "./components/manager/Contact/Contact";
import ManagerEditContact from "./components/manager/Contact/EditContact";
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
            path="/admindashboard/servicerequest/add"
            component={() => <AdminAddServiceRequest />}
          />
          <Route
            path="/admindashboard/servicerequest/:id"
            component={AdminService}
          />
          <Route
            path="/admindashboard/lead"
            exact
            component={() => <AdminLead />}
          />
          <Route path="/admindashboard/lead/add" component={AdminAddLead} />

          <Route path="/admindashboard/lead/:id" component={AdminLeads} />

          <Route
            path="/admindashboard/contact"
            exact
            component={() => <AdminContact />}
          />
          <Route
            path="/admindashboard/contact/add"
            component={AdminAddContact}
          />
          <Route path="/admindashboard/contact/:id" component={AdminContacts} />
          <Route path="/admindashboard/allusers" component={AdminAllUsers} />

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

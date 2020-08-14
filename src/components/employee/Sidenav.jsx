import React from "react";
import { Link } from "react-router-dom";

const delToken = () => {
  localStorage.removeItem("token");
};
const Sidenav = () => {
  return (
    <React.Fragment>
      <nav className="nav">
        <ul>
          <Link to="/employeedashboard/servicerequest">
            <li className="nav-items">Service Request</li>
          </Link>
          <Link to="/employeedashboard/lead">
            <li className="nav-items">Leads</li>
          </Link>
          <Link to="/employeedashboard/contact">
            <li className="nav-items">Contacts</li>
          </Link>
          <Link onClick={() => delToken()} to="/employeelogin">
            <li className="nav-items">Logout</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

import React from "react";
import { Link } from "react-router-dom";

const delToken = () => {
  localStorage.removeItem("token");
};
const Sidenav = () => {
  return (
    <React.Fragment>
      <nav>
        <ul>
          <Link to="/employeedashboard/servicerequest">
            <li>Service Request</li>
          </Link>
          <Link to="/employeedashboard/lead">
            <li>Leads</li>
          </Link>
          <Link to="/employeedashboard/contact">
            <li>Contacts</li>
          </Link>
          <Link onClick={() => delToken()} to="/employeelogin">
            <li>Logout</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

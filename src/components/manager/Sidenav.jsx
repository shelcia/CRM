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
          <Link to="/managerdashboard/servicerequest">
            <li>Service Request</li>
          </Link>
          <Link to="/managerdashboard/lead">
            <li>Leads</li>
          </Link>
          <Link to="/managerdashboard/contact">
            <li>Contacts</li>
          </Link>
          <Link onClick={() => delToken()} to="/managerlogin">
            <li>Logout</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

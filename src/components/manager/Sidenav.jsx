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
          <Link to="/managerdashboard/servicerequest">
            <li className="nav-items">Service Request</li>
          </Link>
          <Link to="/managerdashboard/lead">
            <li className="nav-items">Leads</li>
          </Link>
          <Link to="/managerdashboard/contact">
            <li className="nav-items">Contacts</li>
          </Link>
          <Link onClick={() => delToken()} to="/managerlogin">
            <li className="nav-items">Logout</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

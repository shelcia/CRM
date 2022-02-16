import React from "react";
import { NavLink, Link } from "react-router-dom";

const delToken = () => {
  localStorage.removeItem("token");
};
const Sidenav = () => {
  return (
    <React.Fragment>
      <nav className="nav">
        <ul>
          <li>
            <NavLink
              to="/employeedashboard/servicerequest"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Service Request
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employeedashboard/lead"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employeedashboard/contact"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <Link
              onClick={() => delToken()}
              to="/employeelogin"
              className="nav-items"
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

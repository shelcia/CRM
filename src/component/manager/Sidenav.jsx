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
              to="/managerdashboard/servicerequest"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Service Request
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/managerdashboard/lead"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Lead
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/managerdashboard/contact"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Contacts
            </NavLink>
          </li>
          <li>
            <Link
              onClick={() => delToken()}
              to="/managerlogin"
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

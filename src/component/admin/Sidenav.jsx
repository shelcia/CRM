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
              to="/admindashboard/servicerequest"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Service Request
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admindashboard/lead"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Leads
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admindashboard/contact"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              Contacts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admindashboard/allusers"
              className="nav-items"
              activeClassName={`nav-items active`}
            >
              All Users
            </NavLink>
          </li>
          <li>
            <Link onClick={() => delToken()} to="/" className="nav-items">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

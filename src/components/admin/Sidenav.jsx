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
          <Link to="/admindashboard/servicerequest">
            <li className="nav-items">Service Request</li>
          </Link>
          <Link to="/admindashboard/lead">
            <li className="nav-items">Leads</li>
          </Link>
          <Link to="/admindashboard/contact">
            <li className="nav-items">Contacts</li>
          </Link>
          <Link to="/admindashboard/allusers">
            <li className="nav-items">All Users</li>
          </Link>
          {/* <Link to="/admindashboard/addUser">
            <li className="nav-items">Add User</li>
          </Link>
          <Link to="/admindashboard/deleteuser">
            <li className="nav-items">Delete User</li>
          </Link> */}
          <Link onClick={() => delToken()} to="/">
            <li className="nav-items">Logout</li>
          </Link>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Sidenav;

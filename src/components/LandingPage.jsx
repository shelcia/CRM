import React from "react";
import Logo from "../assets/logo@2x.png";
import Employee from "../assets/employee.png";
import Manager from "../assets/manager.png";
import Admin from "../assets/admin.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <React.Fragment>
      <div className="landing-page">
        <div className="navbar-container">
          <nav>
            <div className="logo-container">
              <img src={Logo} alt="logo" />
            </div>
            <div className="navlist-container">
              <a href="#home">Home</a>
              <a href="#About">About</a>
              <a href="#Login">Login</a>
            </div>
          </nav>
        </div>
        <div className="img-container">
          <img src={Logo} alt="logo" />
        </div>
        <div className="headliner-container">
          <div className="headliner">To MEET all your customer Needs</div>
          <button type="button">More</button>
        </div>
        <div className="login-cards" id="Login">
          <div className="headliner">Who are you?</div>
          <div className="card-container">
            <div className="card">
              <Link to="/employeelogin">
                <img src={Employee} alt="employee" />
              </Link>
            </div>
            <div className="card">
              <Link to="/managerlogin">
                <img src={Manager} alt="manager" />
              </Link>
            </div>
            <div className="card">
              <Link to="/adminlogin">
                <img src={Admin} alt="admin" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <nav></nav>
    </React.Fragment>
  );
};

export default LandingPage;

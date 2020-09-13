import React from "react";
import { Link } from "react-router-dom";

const TitleTemplate = ({ title, link }) => {
  return (
    <div className="header">
      <div className="title">{title}</div>
      <Link to={link}>
        <button type="button">
          Add <i className="material-icons">&#xe147;</i>
        </button>
      </Link>
    </div>
  );
};

export default TitleTemplate;

import React from "react";
import { Link } from "react-router-dom";

const TitleTemplate = ({ title, link, isAdd }) => {
  return (
    <React.Fragment>
      <div className="header">
        <div className="title">{title}</div>
        {isAdd && (
          <Link to={link}>
            <button type="button">
              Add <i className="material-icons">&#xe147;</i>
            </button>
          </Link>
        )}
      </div>
      <hr />
    </React.Fragment>
  );
};

export default TitleTemplate;

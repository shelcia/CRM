import React from "react";
import { Button, useMediaQuery } from "@mui/material";
import SomePic from "../../assets/business-presentation.png";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const matches = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();

  return (
    <section className="wrapper" style={{ borderTop: "3px solid #1d8cf8" }}>
      <div className="row p-4">
        <div className="col-md-6">
          <h1
            style={{
              fontSize: matches ? "7rem" : "3rem",
              textTransform: "uppercase",
              textAlign: "justify",
              fontWeight: 700,
              textShadow: "-0.04em 0.04em #0f3460, -0.06em 0.06em #fd5d93",
              color: "#fff",
            }}
          >
            Easy CRM for Your Basic CRM needs
          </h1>
          <p className="text-danger lead title">*It's in development</p>
        </div>
        <div className="col-md-6">
          {matches && <img src={SomePic} alt="" style={{ maxWidth: "100%" }} />}
          <div>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="ms-3"
              onClick={() => navigate("/signup")}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;

import React from "react";
import Moon from "../../assets/moon.png";
import Telescope from "../../assets/telescope.png";
import RocketLauncher from "../../assets/rocket-launcher.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const ErrorPage = () => {
  const navigate = useNavigate();

  const matches = useMediaQuery("(min-width:600px)");

  return (
    <section className="wrapper">
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-lg-6" style={{ height: "100vh" }}>
          <div style={{ position: "relative" }}>
            <img
              src={Moon}
              alt=""
              style={{
                height: 300,
                width: "auto",
                position: "absolute",
                zIndex: -1,
                top: 10,
                left: 30,
              }}
            />
            {matches && (
              <img
                src={Telescope}
                alt=""
                style={{
                  height: 300,
                  width: "auto",
                  position: "absolute",
                  zIndex: -1,
                  top: "50vh",
                  left: "50%",
                }}
              />
            )}
          </div>

          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="p-5">
              <h1 className="title text-info" style={{ fontSize: "3rem" }}>
                Error 404
              </h1>
              <h2>Page not found</h2>
              <p className="lead">
                Either you tried some kinky link or we screwed up.
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              className="mt-3"
              size="small"
              color="secondary"
            >
              Go to Home Page
            </Button>
          </div>
        </div>

        <div className="col-lg-6 text-center">
          <img
            src={RocketLauncher}
            alt=""
            style={{ maxHeight: "100vh", width: "auto", maxWidth: "100%" }}
          />
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;

import React from "react";
import VuiTypography from "../../components/VuiTypography";

const Home = () => {
  return (
    <React.Fragment>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <VuiTypography variant="h1" color="white">
          Site currrently under Construction !
        </VuiTypography>
      </div>
    </React.Fragment>
  );
};

export default Home;

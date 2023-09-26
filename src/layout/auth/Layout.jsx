import React from "react";
import DefaultNavbar from "../../customcomponents/CustomNavbars/DefaultNavbar";
import Footer from "../../common/Footer";
import { GitHub } from "@mui/icons-material";

const AuthLayout = ({ children }) => {
  const routes = [
    {
      name: "connect",
      collapse: [
        {
          name: "github",
          href: "https://github.com/shelcia/CRM",
          description: "Check code on Github",
          icon: <GitHub />,
        },
      ],
    },
  ];

  return (
    <React.Fragment>
      <DefaultNavbar
        route={routes}
        action={{
          type: "internal",
          route: "/signup",
          color: "info",
          label: "Get Started",
        }}
      />
      {children}
      <Footer />
    </React.Fragment>
  );
};

export default AuthLayout;

import React, { useState } from "react";
import Sidenav from "../../../customcomponents/CustomSidenav";
import { useMaterialUIController, setMiniSidenav } from "../../../context";
import MDAvatar from "../../../components/MDAvatar";
import {
  Call,
  ConfirmationNumberOutlined,
  EmailOutlined,
  FactCheckOutlined,
  Group,
  GroupAdd,
  SourceOutlined,
} from "@mui/icons-material";

const DashboardSidenav = () => {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    // direction,
    // layout,
    // openConfigurator,
    sidenavColor,
    // transparentSidenav,
    // whiteSidenav,
    // darkMode,
  } = controller;
  console.log(sidenavColor);
  const [onMouseEnter, setOnMouseEnter] = useState(false);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const routes = [
    {
      type: "collapse",
      name: "Alex Nadia",
      key: "alex-nadia",
      icon: (
        <MDAvatar
          //   src={profilePicture}
          alt="Brooklyn Alice"
          size="sm"
        />
      ),
      collapse: [
        {
          name: "My Profile",
          key: "my-profile",
          route: "/profile",
        },
        {
          name: "Company Profile",
          key: "my-company",
          route: "/profile/company",
        },
        {
          name: "Settings",
          key: "profile-settings",
          route: "/settings",
        },
        {
          name: "Logout",
          key: "logout",
          route: "/logout",
          //   component: <SignInBasic />,
        },
      ],
    },
    { type: "divider", key: "divider-0" },
    { type: "title", title: "Pages", key: "title-pages" },
    {
      type: "collapse",
      name: "Users",
      key: "users",
      icon: <Group />,
      collapse: [
        {
          name: "New User",
          key: "new-user",
          route: "/add-user",
          icon: <GroupAdd />,
        },
      ],
    },

    {
      type: "collapse",
      name: "Contacts",
      key: "contacts",
      icon: <Call />,
      collapse: [
        {
          name: "All Contacts",
          key: "all-contacts",
          route: "/dashboard/contacts",
          icon: <Call />,
        },
        {
          name: "New Contact",
          key: "new-contact",
          route: "/dashboard/contacts/add-contact",
          icon: <Call />,
        },
      ],
    },

    {
      type: "collapse",
      name: "Tickets",
      key: "tickets",
      icon: <ConfirmationNumberOutlined />,
      collapse: [
        {
          name: "New Ticket",
          key: "new-ticker",
          route: "/add-ticket",
          icon: <ConfirmationNumberOutlined />,
        },
      ],
    },
    {
      type: "collapse",
      name: "Todo",
      key: "todo",
      icon: <FactCheckOutlined />,
      collapse: [
        {
          name: "New Project",
          key: "new-project",
          route: "/add-ticket",
          icon: <FactCheckOutlined />,
        },
      ],
    },
    {
      type: "collapse",
      name: "Email",
      key: "email",
      icon: <EmailOutlined />,
      collapse: [
        {
          name: "New Folder",
          key: "new-folder",
          route: "/add-ticket",
          icon: <EmailOutlined />,
        },
      ],
    },
    {
      type: "collapse",
      name: "CDA",
      key: "cda",
      icon: <SourceOutlined />,
      collapse: [
        {
          name: "New Folder",
          key: "new-cda-folder",
          route: "/add-cda",
          icon: <SourceOutlined />,
        },
      ],
    },
  ];

  return (
    <Sidenav
      color={sidenavColor}
      // brand={whiteSidenav}
      // brand={
      //   (transparentSidenav && !darkMode) || whiteSidenav
      //     ? brandDark
      //     : brandWhite
      // }
      brandName="Easy CRM"
      routes={routes}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    />
  );
};

export default DashboardSidenav;

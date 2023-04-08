import React from "react";
import {
  ConfirmationNumberOutlined,
  // Dashboard,
  EmailOutlined,
  FactCheckOutlined,
  LocalPhoneOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoreVert,
  PeopleAlt,
  PersonOutlineOutlined,
  SourceOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import CustomToggle from "../../../components/CustomToggle";
import { primary } from "../../../theme/themeColors";

// import DashboardIcon from '@mui/icons-material/Dashboard';

const Topbar = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderMenu = (
    <Menu
      id="long-menu"
      MenuListProps={{
        "aria-labelledby": "long-button",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>
        <CustomToggle />
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <PersonOutlineOutlined />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuOutlined />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Easy CRM
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <List sx={{ display: { xs: "none", sm: "flex" } }}>
          {menuContents.map((item, index) => (
            <ListItemButton
              key={index}
              component={NavLink}
              to={item.link}
              style={({ isActive, isPending }) => {
                return {
                  // color: isActive ? primary[500] : "inherit",
                  backgroundColor: isActive ? primary[500] : "inherit",
                  color: isActive ? "#fff" : "inherit",
                  // color: isPending ? "red" : "black",
                };
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="inherit"
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVert />
        </IconButton>
        {renderMenu}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;

export const menuContents = [
  // {
  //   title: "Dashboard",
  //   link: "/admin_dashboard/dashboard",
  //   icon: <Dashboard />,
  // },
  {
    title: "Users",
    link: "/admin_dashboard/users",
    icon: <PeopleAlt />,
  },
  {
    title: "Contacts",
    link: "/admin_dashboard/contacts",
    icon: <LocalPhoneOutlined />,
  },
  {
    title: "Tickets",
    link: "/admin_dashboard/tickets",
    icon: <ConfirmationNumberOutlined />,
  },
  {
    title: "Todos",
    link: "/admin_dashboard/todos",
    icon: <FactCheckOutlined />,
  },
  {
    title: "Email",
    link: "/admin_dashboard/emails",
    icon: <EmailOutlined />,
  },
  {
    title: "CDA",
    link: "/admin_dashboard/cda",
    icon: <SourceOutlined />,
  },
];

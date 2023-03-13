import React from "react";
import {
  ConfirmationNumberOutlined,
  EmailOutlined,
  FactCheckOutlined,
  LocalPhoneOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoreVert,
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
import { NavLink } from "react-router-dom";

const Topbar = ({ handleDrawerToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        <ListItemIcon>
          <PersonOutlineOutlined />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="fixed"
      //   sx={{
      //     // width: { sm: `calc(100% - ${drawerWidth}px)` },
      //     // ml: { sm: `${drawerWidth}px` },
      //     backgroundColor: "#1e1e2f",
      //     backgroundImage: "none",
      //     boxShadow: "none",
      //     borderTop: "2px solid #1d8cf8",
      //   }}
    >
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
            <ListItemButton key={index} component={NavLink} to={item.link}>
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

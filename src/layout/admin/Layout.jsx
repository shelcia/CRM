import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import {
  Phone,
  Package,
  FileText,
  Inbox,
  Book,
  Menu as MenuIcon,
  MoreVertical,
  User,
  LogOut,
} from "react-feather";

const drawerWidth = 250;

const Layout = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContents = [
    {
      title: "Contacts",
      link: "/admin_dashboard/contacts",
      icon: <Phone strokeWidth={1} />,
    },
    {
      title: "Tickets",
      link: "/admin_dashboard/tickets",
      icon: <Package strokeWidth={1} />,
    },
    {
      title: "Todos",
      link: "/admin_dashboard/todos",
      icon: <FileText strokeWidth={1} />,
    },
    {
      title: "Email",
      link: "/admin_dashboard/emails",
      icon: <Inbox strokeWidth={1} />,
    },
    {
      title: "CDA",
      link: "/admin_dashboard/cda",
      icon: <Book strokeWidth={1} />,
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {sidebarContents.map((item, index) => (
          <ListItem button key={index} component={NavLink} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
          <User width="18px" strokeWidth={1.5} />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <LogOut width="18px" strokeWidth={1.5} />
        </ListItemIcon>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <section className="wrapper">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            // ml: { sm: `${drawerWidth}px` },
            backgroundColor: "#1e1e2f",
            backgroundImage: "none",
            boxShadow: "none",
            borderTop: "2px solid #1d8cf8",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Easy CRM
            </Typography>
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
              <MoreVertical />
            </IconButton>
            {renderMenu}
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="sidebar"
          className="sidebar"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 230,
                border: "none",
                // backgroundColor: "transparent",
                background: "linear-gradient(0deg, #3358f4, #1d8cf8)",
                position: "relative",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 230,
                border: "none",
                backgroundColor: "transparent",
                position: "relative",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            overflowY: "scroll",
            // height: "100vh - 64px",
          }}
          className="main-panel"
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </section>
  );
};

export default Layout;

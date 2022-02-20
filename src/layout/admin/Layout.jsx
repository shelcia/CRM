import React, { useContext } from "react";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  IconButton,
  Drawer,
  ListItemText,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import FolderIcon from "@mui/icons-material/Folder";
import { menuList } from "./Sidebar";
import { useLocation, Outlet, useNavigate, Link } from "react-router-dom";
import CustomBox from "../../components/CustomBox";
import CustomTypography from "../../components/CustomTypography";
import CustomFlexbox from "../../components/CustomFlexbox";
import CustomAvatar from "../../components/CustomAvatar";
import LogoutIcon from "@mui/icons-material/Logout";
import { TitleContext } from "../../context/TitleContext";
import Logo from "../../assets/E.png";

const drawerWidth = 240;

const AdminLayout = (props) => {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation();
  // console.log(location);

  const { title } = useContext(TitleContext);

  const isLocationIncluded = (path) => {
    return path.includes(location.pathname);
  };

  const navigate = useNavigate();

  const drawer = (
    <section>
      <Toolbar>
        <CustomBox
          component={Link}
          to="/admin_dashboard/contacts"
          py={1.5}
          lineHeight={1}
          className="d-flex justify-content-between align-items-center"
        >
          <CustomAvatar
            src={Logo}
            variant="square"
            sx={{ width: 30, height: 30, marginRight: 1 }}
          />
          <CustomTypography
            variant="button"
            textGradient={true}
            color="light"
            fontSize={14}
            letterSpacing={2}
            fontWeight="medium"
            // sx={{
            //   margin: "0 auto",
            // }}
          >
            EASY-CRM
          </CustomTypography>
        </CustomBox>
      </Toolbar>
      <Divider />
      <List dense={true}>
        {menuList.map((item, index) => (
          <ListItem
            style={{
              marginBottom: 8,
              background: isLocationIncluded(item.path)
                ? "rgba(26, 31, 55, 0.6)"
                : "rgba(0, 0, 0, 0)",
              padding: "0.475rem 0.6rem 0.475rem 0.8rem",
              borderRadius: "0.85rem",
              cursor: "pointer",
            }}
            key={index}
            onClick={() => navigate(item.path)}
          >
            <ListItemAvatar>
              {isLocationIncluded(item.path) ? item.ActiveIcon : item.Icon}
            </ListItemAvatar>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </section>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <CustomBox sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backdropFilter: "blur(2.625rem)",
          borderRadius: "1.25rem",
        }}
      >
        <Toolbar className="w-100">
          <IconButton
            color="white"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <CustomFlexbox
            alignItems="center"
            sx={{ justifyContent: "space-between" }}
            className="w-100"
          >
            <CustomTypography textGradient={true} component="div" color="light">
              {title}
            </CustomTypography>
            <IconButton color="white" edge="end">
              <LogoutIcon color="white" />
            </IconButton>
          </CustomFlexbox>
        </Toolbar>
      </AppBar>
      <CustomBox
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
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
              width: drawerWidth,
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
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </CustomBox>
      {children}
      <Outlet />
    </CustomBox>
  );
};

export default AdminLayout;

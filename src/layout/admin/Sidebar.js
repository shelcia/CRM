import PhoneIcon from "@mui/icons-material/Phone";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EmailIcon from "@mui/icons-material/Email";
import SourceIcon from "@mui/icons-material/Source";
import CustomAvatar from "../../components/CustomAvatar";
import { Icon } from "@mui/material";

export const menuList = [
  {
    title: "Contact",
    Icon: (
      <CustomAvatar bgColor="dark" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <PhoneIcon color="info" />
        </Icon>
      </CustomAvatar>
    ),
    ActiveIcon: (
      <CustomAvatar bgColor="info" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <PhoneIcon />
        </Icon>
      </CustomAvatar>
    ),
    path: "/admin_dashboard/contacts",
  },
  {
    title: "Tickets",
    // Icon: <ConfirmationNumberIcon />,
    Icon: (
      <CustomAvatar bgColor="dark" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <ConfirmationNumberIcon color="info" />
        </Icon>
      </CustomAvatar>
    ),
    ActiveIcon: (
      <CustomAvatar bgColor="info" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <ConfirmationNumberIcon />
        </Icon>
      </CustomAvatar>
    ),
    path: "/admin_dashboard/tickets",
  },
  {
    title: "Todos",
    // Icon: <FormatListBulletedIcon />,
    Icon: (
      <CustomAvatar bgColor="dark" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <FormatListBulletedIcon color="info" />
        </Icon>
      </CustomAvatar>
    ),
    ActiveIcon: (
      <CustomAvatar bgColor="info" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <FormatListBulletedIcon />
        </Icon>
      </CustomAvatar>
    ),
    path: "/admin_dashboard/todos",
  },
  {
    title: "Email",
    Icon: (
      <CustomAvatar bgColor="dark" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <EmailIcon color="info" />
        </Icon>
      </CustomAvatar>
    ),
    ActiveIcon: (
      <CustomAvatar bgColor="info" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <EmailIcon />
        </Icon>
      </CustomAvatar>
    ),
    path: "/admin_dashboard/emails",
  },
  {
    title: "CMS",
    Icon: (
      <CustomAvatar bgColor="dark" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <SourceIcon color="info" />
        </Icon>
      </CustomAvatar>
    ),
    ActiveIcon: (
      <CustomAvatar bgColor="info" size="sm" variant="rounded">
        <Icon fontSize="lg">
          <SourceIcon />
        </Icon>
      </CustomAvatar>
    ),
    path: "/admin_dashboard/cms",
  },
];

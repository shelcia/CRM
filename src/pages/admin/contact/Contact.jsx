import React from "react";
import { ShoppingBag } from "@mui/icons-material";
import { Card, Toolbar } from "@mui/material";
import CustomBadge from "../../../components/CustomBadge";
import CustomBox from "../../../components/CustomBox";
import CustomTypography from "../../../components/CustomTypography";
import useTitle from "../../../hooks/useTitle";

const Contact = () => {
  useTitle("Contact");

  return (
    <CustomBox
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - 260px)` },
      }}
    >
      <Toolbar />

      <Card>
        <CustomBox bgColor={"white"} variant="gradient">
          <CustomBox pt={3} px={3}>
            <CustomTypography variant="h6" fontWeight="medium" color={"white"}>
              Contact Name
            </CustomTypography>
          </CustomBox>
          <CustomBox p={2}>
            <TimelineItem
              color="success"
              icon={"shopping_cart"}
              title="$2400 Design changes"
              dateTime="22 DEC 7:20 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={{ items: ["design"], color: "info" }}
            />
            <TimelineItem
              color="error"
              icon={"shopping_cart"}
              title="New order #1832412"
              dateTime="21 DEC 11 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={{ items: ["order", "#1832412"], color: "info" }}
            />
            <TimelineItem
              icon={"shopping_cart"}
              title="Server payments for April"
              dateTime="21 DEC 9:34 PM"
              description="People care about how you see the world, how you think, what motivates you, what you’re struggling with or afraid of."
              badges={{ items: ["server", "payments"], color: "info" }}
              lastItem={true}
            />
          </CustomBox>
        </CustomBox>
      </Card>
    </CustomBox>
  );
};

export default Contact;

const TimelineItem = ({
  color = "info",
  icon,
  title,
  dateTime,
  description = "",
  badges,
  lastItem = false,
}) => {
  const renderBadges = badges?.items?.map((badge, key) => {
    const badgeKey = `badge-${key}`;

    return (
      <CustomBox key={badgeKey} mr={key === badges.length - 1 ? 0 : 0.5}>
        <CustomBadge color={"info"} size="xs" badgeContent={badge} container />
      </CustomBox>
    );
  });

  return (
    <CustomBox
      position="relative"
      mb="24px"
      sx={(theme) => timelineItem(theme, { color, lastItem })}
    >
      <CustomBox
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        // top="3.25%"
        // left="-8px"
        top="-6%"
        left="4px"
        zIndex={2}
      >
        <ShoppingBag />
        {/* {icon} */}
      </CustomBox>
      <CustomBox
        ml="30px"
        pt={description ? 0.7 : 0.5}
        lineHeight={0}
        maxWidth="30rem"
      >
        <CustomTypography variant="button" fontWeight="medium" color="white">
          {title}
        </CustomTypography>
        <CustomBox mt={0.5}>
          <CustomTypography variant="caption" fontWeight="medium" color="text">
            {dateTime}
          </CustomTypography>
        </CustomBox>
        <CustomBox mt={2} mb={1.5}>
          {description ? (
            <CustomTypography
              variant="button"
              fontWeight="regular"
              color="text"
            >
              {description}
            </CustomTypography>
          ) : null}
        </CustomBox>
        {badges?.items?.length > 0 ? (
          <CustomBox display="flex" pb={lastItem ? 1 : 2}>
            {renderBadges}
          </CustomBox>
        ) : null}
      </CustomBox>
    </CustomBox>
  );
};

function timelineItem(theme, ownerState) {
  const { borders } = theme;
  const { lastItem } = ownerState;

  const { borderWidth, borderColor } = borders;
  // console.log(borderColor);

  return {
    "&:after": {
      content: "''",
      position: "absolute",
      top: "10%",
      left: "14px",
      height: lastItem ? "90%" : "100%",
      borderRight: `${borderWidth[2]} solid ${borderColor?.grey?.borderCol?.main}`,
    },
  };
}

import React from "react";
import { Link } from "react-router-dom";
import CustomBox from "../../components/CustomBox";
import CustomTypography from "../../components/CustomTypography";

function Footer() {
  return (
    <CustomBox
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      direction="row"
      component="footer"
      py={2}
      pb={0}
    >
      <CustomBox item xs={12} sx={{ textAlign: "center" }}>
        <CustomTypography
          variant="button"
          sx={{ textAlign: "center", fontWeight: "400 !important" }}
          color="white"
        >
          Made with ❤️&nbsp;&nbsp;&nbsp; by © 2022
          <CustomTypography
            ml="2px"
            mr="2px"
            component="a"
            variant="button"
            href="https://shelcia-dev.me"
            sx={{ textAlign: "center", fontWeight: "500 !important" }}
            color="white"
          >
            Shelcia
          </CustomTypography>
        </CustomTypography>
      </CustomBox>
      <CustomBox item xs={10}>
        <CustomBox
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          mb={3}
        >
          <CustomBox mr={{ xs: "20px", lg: "46px" }}>
            <CustomTypography
              component={Link}
              to="/privacy-policy"
              variant="body2"
              color="white"
            >
              Privacy Policy
            </CustomTypography>
          </CustomBox>
          <CustomBox mr={{ xs: "20px", lg: "46px" }}>
            <CustomTypography
              component="a"
              href="https://github.com/shelcia/CRM/blob/master/LICENSE"
              variant="body2"
              color="white"
            >
              License
            </CustomTypography>
          </CustomBox>
          <CustomBox>
            <CustomTypography
              component="a"
              href="https://github.com/shelcia/CRM"
              variant="body2"
              color="white"
            >
              Github
            </CustomTypography>
          </CustomBox>
        </CustomBox>
      </CustomBox>
      {/* <CustomBox item xs={10}>
        <CustomBox
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          mb={3}
        >
          <CustomBox>
            <CustomTypography
              component={Link}
              to="/privacy-policy"
              variant="body2"
              color="white"
            >
              Privacy Policy
            </CustomTypography>
          </CustomBox>

          <CustomBox>
            <CustomTypography
              component="a"
              href="https://github.com/shelcia/CRM/blob/master/LICENSE"
              variant="body2"
              color="white"
            >
              License
            </CustomTypography>
          </CustomBox>
          <CustomBox mr={{ xs: "20px", lg: "46px" }}>
            <CustomTypography
              component="a"
              href="https://github.com/shelcia/CRM"
              variant="body2"
              color="white"
            >
              Github
            </CustomTypography>
          </CustomBox>
        </CustomBox>
      </CustomBox> */}
    </CustomBox>
  );
}

export default Footer;

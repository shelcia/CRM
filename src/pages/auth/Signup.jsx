import { Icon, IconButton, Input, Stack, Switch } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomBox from "../../components/CustomBox";
import CustomButton from "../../components/CustomButton";
import CustomTypography from "../../components/CustomTypography";

import radialGradient from "../../theme/functions/radialGradient";
import rgba from "../../theme/functions/rgba";
import palette from "../../theme/base/colors";
import borders from "../../theme/base/borders";
import CoverLayout from "./CoverLayout";

import bgSignIn from "../../assets/signInImage.png";

import FacebookIcon from "@mui/icons-material/Facebook";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";

const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(true);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <CoverLayout
      title="Welcome!"
      color="white"
      description="Use these awesome forms to login or create new account in your project for free."
      image={bgSignIn}
      premotto="INSPIRED BY THE FUTURE:"
      motto="THE VISION UI DASHBOARD"
      cardContent
    >
      <GradientBorder
        borderRadius={borders.borderRadius.form}
        minWidth="100%"
        maxWidth="100%"
      >
        <CustomBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <CustomTypography
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            Register with
          </CustomTypography>
          <Stack
            mb="25px"
            justifyContent="center"
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <GradientBorder borderRadius="xl">
              <IconButton
                transition="all .25s ease"
                justify="center"
                align="center"
                bg="rgb(19,21,54)"
                borderRadius="15px"
                sx={({
                  palette: { secondary },
                  borders: { borderRadius },
                }) => ({
                  borderRadius: borderRadius.xl,
                  padding: "25px",
                  backgroundColor: secondary.focus,
                  "&:hover": {
                    backgroundColor: rgba(secondary.focus, 0.9),
                  },
                })}
              >
                <Icon
                  as={FacebookIcon}
                  w="30px"
                  h="30px"
                  sx={({ palette: { white } }) => ({
                    color: white.focus,
                  })}
                />
              </IconButton>
            </GradientBorder>
            <GradientBorder borderRadius="xl">
              <IconButton
                transition="all .25s ease"
                justify="center"
                align="center"
                bg="rgb(19,21,54)"
                borderRadius="15px"
                sx={({
                  palette: { secondary },
                  borders: { borderRadius },
                }) => ({
                  borderRadius: borderRadius.xl,
                  padding: "25px",
                  backgroundColor: secondary.focus,
                  "&:hover": {
                    backgroundColor: rgba(secondary.focus, 0.9),
                  },
                })}
              >
                <Icon
                  as={AppleIcon}
                  w="30px"
                  h="30px"
                  sx={({ palette: { white } }) => ({
                    color: white.focus,
                  })}
                />
              </IconButton>
            </GradientBorder>
            <GradientBorder borderRadius="xl">
              <IconButton
                transition="all .25s ease"
                justify="center"
                align="center"
                bg="rgb(19,21,54)"
                borderRadius="15px"
                sx={({
                  palette: { secondary },
                  borders: { borderRadius },
                }) => ({
                  borderRadius: borderRadius.xl,
                  padding: "25px",
                  backgroundColor: secondary.focus,
                  "&:hover": {
                    backgroundColor: rgba(secondary.focus, 0.9),
                  },
                })}
              >
                <Icon
                  as={GoogleIcon}
                  w="30px"
                  h="30px"
                  sx={({ palette: { white } }) => ({
                    color: white.focus,
                  })}
                />
              </IconButton>
            </GradientBorder>
          </Stack>
          <CustomTypography
            color="text"
            fontWeight="bold"
            textAlign="center"
            mb="14px"
            sx={({ typography: { size } }) => ({ fontSize: size.lg })}
          >
            or
          </CustomTypography>
          <CustomBox mb={2}>
            <CustomBox mb={1} ml={0.5}>
              <CustomTypography
                component="label"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Name
              </CustomTypography>
            </CustomBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <Input
                placeholder="Your full name..."
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </CustomBox>
          <CustomBox mb={2}>
            <CustomBox mb={1} ml={0.5}>
              <CustomTypography
                component="label"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Email
              </CustomTypography>
            </CustomBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <Input
                type="email"
                placeholder="Your email..."
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </CustomBox>
          <CustomBox mb={2}>
            <CustomBox mb={1} ml={0.5}>
              <CustomTypography
                component="label"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Password
              </CustomTypography>
            </CustomBox>
            <GradientBorder
              minWidth="100%"
              borderRadius={borders.borderRadius.lg}
              padding="1px"
              backgroundImage={radialGradient(
                palette.gradients.borderLight.main,
                palette.gradients.borderLight.state,
                palette.gradients.borderLight.angle
              )}
            >
              <Input
                type="password"
                placeholder="Your password..."
                sx={({ typography: { size } }) => ({
                  fontSize: size.sm,
                })}
              />
            </GradientBorder>
          </CustomBox>
          <CustomBox display="flex" alignItems="center">
            <Switch
              color="info"
              checked={rememberMe}
              onChange={handleSetRememberMe}
            />
            <CustomTypography
              variant="caption"
              color="white"
              fontWeight="medium"
              onClick={handleSetRememberMe}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;Remember me
            </CustomTypography>
          </CustomBox>
          <CustomBox mt={4} mb={1}>
            <CustomButton color="info" fullWidth>
              SIGN UP
            </CustomButton>
          </CustomBox>
          <CustomBox mt={3} textAlign="center">
            <CustomTypography
              variant="button"
              color="text"
              fontWeight="regular"
            >
              Already have an account?{" "}
              <CustomTypography
                component={Link}
                to="/login"
                variant="button"
                color="white"
                fontWeight="medium"
              >
                Sign in
              </CustomTypography>
            </CustomTypography>
          </CustomBox>
        </CustomBox>
      </GradientBorder>
    </CoverLayout>
  );
};

export default SignIn;

const GradientBorder = (props) => {
  const { backgroundImage, children, borderRadius, width, minWidth, ...rest } =
    props;
  return (
    <CustomBox
      padding="2px"
      width={width}
      minWidth={minWidth}
      height="fit-content"
      borderRadius={borderRadius}
      sx={{
        height: "fit-content",
        backgroundImage: backgroundImage
          ? backgroundImage
          : "radial-gradient(94.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
      }}
      {...rest}
    >
      {children}
    </CustomBox>
  );
};

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
// import linearGradient from "assets/theme/functions/linearGradient";
import { forwardRef } from "react";
import PropTypes from "prop-types";

const StyledButton = styled(Button)(({ theme, ownerState }) => {
  const { palette, functions, borders } = theme;
  const { color, variant, size, circular, iconOnly } = ownerState;

  const { white, dark, text, transparent, gradients } = palette;
  const { boxShadow, pxToRem, rgba, linearGradient } = functions;
  const { borderRadius } = borders;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    // background color value
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    // backgroundColor value when button is focused
    const focusedBackgroundValue = palette[color]
      ? palette[color].focus
      : white.focus;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], dark.main, 0.5);

    // color value
    let colorValue = white.main;

    if (color === "white" || !palette[color]) {
      colorValue = white.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    }

    // color value when button is focused
    let focusedColorValue = white.main;

    if (color === "white") {
      focusedColorValue = text.main;
    } else if (color === "primary" || color === "error" || color === "dark") {
      focusedColorValue = white.main;
    }

    return {
      background: backgroundValue,
      color: colorValue,

      "&:hover": {
        backgroundColor: backgroundValue,
      },

      "&:focus:not(:hover)": {
        backgroundColor: focusedBackgroundValue,
        boxShadow: boxShadowValue,
      },

      "&:disabled": {
        backgroundColor: backgroundValue,
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with variant="outlined"
  const outliedStyles = () => {
    // background color value
    const backgroundValue =
      color === "white" ? transparent.main : transparent.main;

    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    // border color value
    let borderColorValue = palette[color]
      ? palette[color].main
      : rgba(white.main, 0.75);

    if (color === "white") {
      borderColorValue = rgba(white.main, 0.75);
    }

    return {
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,

      "&:hover": {
        background: transparent.main,
        borderColor: colorValue,
      },

      "&:focus:not(:hover)": {
        background: transparent.main,
        boxShadow: boxShadowValue,
      },

      "&:active:not(:hover)": {
        backgroundColor: colorValue,
        color: white.main,
        opacity: 0.85,
      },

      "&:disabled": {
        color: colorValue,
        borderColor: colorValue,
      },
    };
  };

  // styles for the button with variant="gradient"
  const gradientStyles = () => {
    // background value
    const backgroundValue = linearGradient(
      palette.gradients[color]?.main,
      palette.gradients[color]?.state,
      palette.gradients[color]?.deg
    );
    // "linear-gradient(126.97deg, rgba(222, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)";

    // color value
    let colorValue = white.main;

    if (color === "white") {
      colorValue = white.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    } else {
      colorValue = white.main;
    }

    return {
      background: backgroundValue,
      color: colorValue,

      "&:focus:not(:hover)": {
        boxShadow: "none",
      },

      "&:disabled": {
        background: backgroundValue,
        color: colorValue,
      },
    };
  };

  // styles for the button with variant="text"
  const textStyles = () => {
    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // color value when button is focused
    const focusedColorValue = palette[color]
      ? palette[color].focus
      : palette[color].focus;

    return {
      color: colorValue,

      "&:hover": {
        color: focusedColorValue,
      },

      "&:focus:not(:hover)": {
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with circular={true}
  const circularStyles = () => ({
    borderRadius: borderRadius.section,
  });

  // styles for the button with iconOnly={true}
  const iconOnlyStyles = () => {
    // width, height, minWidth and minHeight values
    let sizeValue = pxToRem(38);

    if (size === "small") {
      sizeValue = pxToRem(25.4);
    } else if (size === "large") {
      sizeValue = pxToRem(52);
    }

    // padding value
    let paddingValue = `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}`;

    if (size === "small") {
      paddingValue = pxToRem(4.5);
    } else if (size === "large") {
      paddingValue = pxToRem(16);
    }

    return {
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,
      padding: paddingValue,

      "& .material-icons": {
        marginTop: 0,
      },

      "&:hover, &:focus, &:active": {
        transform: "none",
      },
    };
  };

  return {
    ...(variant === "contained" && containedStyles()),
    ...(variant === "outlined" && outliedStyles()),
    ...(variant === "gradient" && gradientStyles()),
    ...(variant === "text" && textStyles()),
    ...(circular && circularStyles()),
    ...(iconOnly && iconOnlyStyles()),
  };
});

const CustomButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => (
    <StyledButton
      {...rest}
      ref={ref}
      color="white"
      variant={variant === "gradient" ? "contained" : variant}
      size={size}
      ownerState={{ color, variant, size, circular, iconOnly }}
    >
      {children}
    </StyledButton>
  )
);

// Setting default values for the props of CustomButton
CustomButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

// Typechecking props for the CustomButton
CustomButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default CustomButton;
/* eslint-disable no-unused-vars */
import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { Icon, InputBase, styled } from "@mui/material";

const CustomInput = forwardRef(
  ({ size, icon, error, success, disabled, ...rest }, ref) => {
    let template;

    const iconDirection = "left";
    const direction = "left";

    if (icon.component && icon.direction === "left") {
      template = (
        <CustomInputWithIcon
          ref={ref}
          ownerState={{ error, success, disabled }}
        >
          <CustomInputIconBox ownerState={{ size }}>
            <CustomInputIcon fontSize="small" ownerState={{ size }}>
              {icon.component}
            </CustomInputIcon>
          </CustomInputIconBox>
          <CustomInputRoot
            {...rest}
            ownerState={{
              size,
              error,
              success,
              iconDirection,
              direction,
              disabled,
            }}
          />
        </CustomInputWithIcon>
      );
    } else if (icon.component && icon.direction === "right") {
      template = (
        <CustomInputWithIcon
          ref={ref}
          ownerState={{ error, success, disabled }}
        >
          <CustomInputRoot
            {...rest}
            ownerState={{
              size,
              error,
              success,
              iconDirection,
              direction,
              disabled,
            }}
          />
          <CustomInputIconBox ownerState={{ size }}>
            <CustomInputIcon fontSize="small" ownerState={{ size }}>
              {icon.component}
            </CustomInputIcon>
          </CustomInputIconBox>
        </CustomInputWithIcon>
      );
    } else {
      template = (
        <CustomInputRoot
          {...rest}
          ref={ref}
          ownerState={{ size, error, success, disabled }}
        />
      );
    }

    return template;
  }
);

// Setting default values for the props of CustomInput
CustomInput.defaultProps = {
  size: "medium",
  icon: {
    component: false,
    direction: "none",
  },
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the CustomInput
CustomInput.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    direction: PropTypes.oneOf(["none", "left", "right"]),
  }),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CustomInput;

const CustomInputRoot = styled(InputBase)(({ theme, ownerState }) => {
  const { palette, boxShadows, functions, typography, borders } = theme;
  const { size, error, success, iconDirection, direction, disabled } =
    ownerState;

  const { inputColors, white, grey } = palette;
  const { inputBoxShadow } = boxShadows;
  const { pxToRem, boxShadow } = functions;
  const { size: fontSize } = typography;
  const { borderRadius } = borders;

  // border color value

  let borderColorValue = "";

  if (error) {
    borderColorValue = inputColors.error;
  } else if (success) {
    borderColorValue = inputColors.success;
  }

  // styles for the input with size="small"
  const smallStyles = () => ({
    fontSize: fontSize.xs,
    padding: `${pxToRem(4)} ${pxToRem(12)}`,
  });

  // styles for the input with size="medium"
  const mediumStyles = () => ({
    padding: `${pxToRem(8)} ${pxToRem(12)}`,
  });

  // styles for the input with size="large"
  const largeStyles = () => ({
    padding: pxToRem(12),
  });

  // styles for the focused state of the input
  let focusedBorderColorValue = inputColors.borderColor.focus;

  if (error) {
    focusedBorderColorValue = inputColors.error;
  } else if (success) {
    focusedBorderColorValue = inputColors.success;
  }

  let focusedPaddingLeftValue;

  if (direction === "rtl" && iconDirection === "left") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "rtl" && iconDirection === "right") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "right") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "left") {
    focusedPaddingLeftValue = pxToRem(12);
  }

  let focusedPaddingRightValue;

  if (direction === "rtl" && iconDirection === "left") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "rtl" && iconDirection === "right") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "right") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "left") {
    focusedPaddingRightValue = pxToRem(12);
  }

  let focusedBoxShadowValue = boxShadow(
    [0, 0],
    [0, 2],
    inputColors.boxShadow,
    1
  );

  if (error) {
    focusedBoxShadowValue = inputBoxShadow.error;
  } else if (success) {
    focusedBoxShadowValue = inputBoxShadow.success;
  }

  // styles for the input with error={true}
  const errorStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23fd5c70' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23fd5c70' stroke='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
    borderColor: inputColors.error,
  });

  // styles for the input with success={true}
  const successStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%2366d432' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
    borderColor: inputColors.success,
  });

  // styles for the input containing an icon
  const withIconStyles = () => {
    let withIconBorderRadiusValue = `0 ${borderRadius.md} ${borderRadius.md} 0`;

    if (direction === "rtl" && iconDirection === "left") {
      withIconBorderRadiusValue = `0 ${borderRadius.md} ${borderRadius.md} 0`;
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconBorderRadiusValue = `${borderRadius.md} 0 0 ${borderRadius.md}`;
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconBorderRadiusValue = `${borderRadius.md} 0 0 ${borderRadius.md}`;
    }

    let withIconPaddingLeftValue;
    if (direction === "rtl" && iconDirection === "left") {
      withIconPaddingLeftValue = 0;
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconPaddingLeftValue = pxToRem(12);
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconPaddingLeftValue = pxToRem(12);
    } else if (direction === "ltr" && iconDirection === "left") {
      withIconPaddingLeftValue = 0;
    }

    let withIconPaddingRightValue;

    if (direction === "rtl" && iconDirection === "left") {
      withIconPaddingRightValue = pxToRem(12);
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconPaddingRightValue = 0;
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconPaddingRightValue = 0;
    } else if (direction === "ltr" && iconDirection === "left") {
      withIconPaddingRightValue = pxToRem(12);
    }

    return {
      paddingLeft: withIconPaddingLeftValue,
      paddingRight: withIconPaddingRightValue,
    };
  };

  return {
    // backgroundColor: disabled ? `${grey[200]} !important` : white.main,
    pointerEvents: disabled ? "none" : "auto",
    backgroundColor: `${
      disabled ? grey[600] : inputColors.backgroundColor
    } !important`,
    color: `${white.main} !important`,
    borderRadius: borderRadius.lg,
    border: `0.5px solid ${grey[600]}`,
    ...(size === "small" && smallStyles()),
    ...(size === "medium" && mediumStyles()),
    ...(size === "large" && largeStyles()),
    ...(error && errorStyles()),
    ...(success && successStyles()),
    ...((iconDirection === "left" || iconDirection === "right") &&
      withIconStyles()),
    "& ::placeholder": {
      color: `${white.main} !important`,
      fontSize: "12px",
    },

    "&.Mui-focused": {
      borderColor: focusedBorderColorValue,
      paddingLeft: focusedPaddingLeftValue,
      paddingRight: focusedPaddingRightValue,
      boxShadow: focusedBoxShadowValue,
      outline: 0,
    },

    "&.MuiInputBase-multiline": {
      padding: `${pxToRem(10)} ${pxToRem(12)}`,
    },
  };
});

const CustomInputIcon = styled(Icon)(({ theme, ownerState }) => {
  const { typography } = theme;
  const { size } = ownerState;

  const { fontWeightBold, size: fontSize } = typography;

  return {
    fontWeight: fontWeightBold,
    fontSize: size === "small" && `${fontSize.md} !important`,
  };
});

const CustomInputWithIcon = styled("div")(({ theme, ownerState }) => {
  const { palette, functions, borders } = theme;
  const { error, success, disabled } = ownerState;

  const { inputColors, grey, white } = palette;
  const { pxToRem } = functions;
  const { borderRadius, borderWidth } = borders;

  // border color value
  let borderColorValue = inputColors.borderColor.main;

  if (error) {
    borderColorValue = inputColors.error;
  } else if (success) {
    borderColorValue = inputColors.success;
  }

  return {
    display: "flex",
    alignItems: "center",
    backgroundColor: disabled ? grey[600] : inputColors.backgroundColor,
    border: `${borderWidth[1]} solid`,
    borderRadius: borderRadius.lg,
    borderColor: borderColorValue,
    "& .MuiIcon-root": {
      color: grey[500],
    },

    "& .MuiInputBase-input": {
      color: white.main,
      height: "100%",
      paddingX: pxToRem(20),
      backgroundColor: disabled ? grey[600] : inputColors.backgroundColor,
    },
    "& .MuiInputBase-root": {
      border: `unset`,
      borderRadius: borderRadius.lg,
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
      backgroundColor: `${
        disabled ? grey[600] : inputColors.backgroundColor
      } !important`,
      "& ::placeholder": {
        color: `${white.main} !important`,
      },
    },
  };
});

const CustomInputIconBox = styled("div")(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { size } = ownerState;

  const { dark } = palette;
  const { pxToRem } = functions;

  return {
    lineHeight: 0,
    padding:
      size === "small"
        ? `${pxToRem(4)} ${pxToRem(10)}`
        : `${pxToRem(8)} ${pxToRem(10)}`,
    width: pxToRem(39),
    height: "100%",
    color: dark.main,
  };
});

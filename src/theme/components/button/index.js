/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Vision UI Dashboard React Button Styles
import root from "./root";
import contained from "./contained";
import outlined from "./outlined";
import text from "./text";

export default {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: { ...root },
    contained: { ...contained.base },
    containedSizeSmall: { ...contained.small },
    containedSizeLarge: { ...contained.large },
    containedPrimary: { ...contained.primary },
    containedSecondary: { ...contained.secondary },
    outlined: { ...outlined.base },
    outlinedSizeSmall: { ...outlined.small },
    outlinedSizeLarge: { ...outlined.large },
    outlinedPrimary: { ...outlined.primary },
    outlinedSecondary: { ...outlined.secondary },
    text: { ...text.base },
    textSizeSmall: { ...text.small },
    textSizeLarge: { ...text.large },
    textPrimary: { ...text.primary },
    textSecondary: { ...text.secondary },
  },
};

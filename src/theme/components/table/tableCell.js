/* eslint-disable import/no-anonymous-default-export */
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

// Vision UI Dashboard React base styles
import borders from "../../base/borders";
import colors from "../../base/colors";

// Vision UI Dashboard React helper functions
import pxToRem from "../../functions/pxToRem";

const { borderWidth } = borders;
const { white } = colors;

// console.log({ borderWidth });

export default {
  styleOverrides: {
    root: {
      // backgroundColor: `${light.main} !important`,
      padding: `${pxToRem(12)} ${pxToRem(16)}`,
      // "& .MuiBox-root": {
      //   pl: "0px !important",
      // },
      color: white,
      fontSize: 14,
      // borderBottom: `${borderWidth[1]} solid ${light.main} !important`,
      borderBottom: `${borderWidth[1]} solid rgb(45, 55, 72) !important`,
    },
  },
};
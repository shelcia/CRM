import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: [
      "Poppins",
      "Trebuchet MS",
      "Lucida Sans Unicode",
      "Lucida Grande",
      "Lucida Sans",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    fontSize: 12,
    color: "#525f7f",
    fontWeight: 400,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        filledInfo: {
          backgroundColor: "#419ef9",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "transparent",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "0.4285rem",
          color: "inherit",
          boxShadow: "none",
          padding: "11px 25px",
          fontWeight: 600,
          fontSize: "0.875rem",
        },
        outlinedPrimary: {
          borderColor: "#e14eca",
          color: "#e14eca",
        },
        containedPrimary: {
          color: "white",
          backgroundImage:
            "linear-gradient(to bottom left,#e14eca,#ba54f5,#e14eca)",
          backgroundSize: "210% 210%",
          backgroundPosition: "100% 0",
          backgroundColor: "#e14eca",
          transition: "all .6s ease",
          "&:hover": {
            backgroundPosition: "0 100%",
            boxShadow: "2px 2px 6px rgba(0 0 0 ,0.4)",
          },
        },
        containedSizeSmall: {
          borderRadius: "0.2857rem",
          padding: "5px 15px",
        },
        outlinedSecondary: {
          //   borderColor: "#3358f4",
          //   color: "#3358f4",
          borderColor: "#1d8cf8",
          color: "#1d8cf8",
          transition: "all .6s ease",
          "&:hover": {
            borderColor: "#3358f4",
            color: "#fff",
            backgroundImage:
              "linear-gradient(to bottom left,#1d8cf8,#3358f4,#1d8cf8)",
            boxShadow: "2px 2px 6px rgba(0 0 0 ,0.4)",
          },
        },
        containedSecondary: {
          color: "white",
          backgroundImage:
            "linear-gradient(to bottom left,#1d8cf8,#3358f4,#1d8cf8)",
          backgroundSize: "210% 210%",
          backgroundPosition: "100% 0",
          backgroundColor: "#1d8cf8",
          transition: "all .6s ease",
          "&:hover": {
            backgroundPosition: "0 100%",
            boxShadow: "2px 2px 6px rgba(0 0 0 ,0.4)",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root:last-of-type": {
            "& .MuiTableCell-root": {
              borderBottom: 0,
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        outlinedPrimary: {
          "& input::placeholder": {
            color: "#222a42",
            opacity: 1,
          },
          "& label": {
            color: "#222a42",
            opacity: 1,
            fontWeight: 500,
          },
        },
      },
      // styleOverrides: {
      //   root: {
      //     "& input::placeholder": {
      //       color: "#222a42",
      //       opacity: 0.6,
      //     },
      //     "& label": {
      //       color: "#222a42",
      //       opacity: 1,
      //       fontWeight: 500,
      //     },
      //   },
      // },
      // "& label.Mui-focused": {
      //   color: "green",
      // },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          background: "#222a42",
        },
      },
    },
  },
});

// import { createTheme, responsiveFontSizes } from "@mui/material";
// import merge from "lodash.merge";
// import { THEMES } from "../constants";
// import { error, info, primary, secondary, success, warning } from "./themeColors";
// const fontSize = 14;
// const baseOptions = {
//   direction: "ltr",
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 960,
//       lg: 1280,
//       xl: 1920
//     }
//   },
//   components: {
//     MuiAvatar: {
//       styleOverrides: {
//         fallback: {
//           height: "75%",
//           width: "75%"
//         }
//       }
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: "4px",
//           color: "inherit",
//           boxShadow: "none",
//           padding: "0.6rem 1.5rem"
//         },
//         outlinedPrimary: {
//           borderColor: primary.main,
//           color: primary.main
//         },
//         containedPrimary: {
//           color: "white",
//           "&:hover": {
//             backgroundColor: primary.dark,
//             boxShadow: "none"
//           }
//         }
//       }
//     },
//     MuiCssBaseline: {
//       styleOverrides: {
//         "*": {
//           boxSizing: "border-box"
//         },
//         html: {
//           MozOsxFontSmoothing: "grayscale",
//           WebkitFontSmoothing: "antialiased",
//           height: "100%",
//           width: "100%"
//         },
//         body: {
//           height: "100%"
//         },
//         a: {
//           textDecoration: "none",
//           color: "inherit"
//         },
//         "#root": {
//           height: "100%"
//         },
//         "#nprogress .bar": {
//           zIndex: "9999 !important",
//           backgroundColor: "#61A9FF !important",
//           width: "100%",
//           position: "fixed"
//         },
//         "input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button": {
//           WebkitAppearance: "none",
//           margin: 0
//         }
//       }
//     },
//     MuiCardHeader: {
//       defaultProps: {
//         titleTypographyProps: {
//           variant: "h6"
//         }
//       }
//     },
//     MuiLinearProgress: {
//       styleOverrides: {
//         root: {
//           borderRadius: 3,
//           overflow: "hidden",
//           backgroundColor: "#E5EAF2"
//         }
//       }
//     },
//     MuiListItemIcon: {
//       styleOverrides: {
//         root: {
//           minWidth: "auto",
//           marginRight: "16px"
//         }
//       }
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           backgroundImage: "none"
//         }
//       }
//     },
//     MuiAccordion: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "transparent",
//           boxShadow: "none"
//         }
//       }
//     },
//     MuiAccordionSummary: {
//       styleOverrides: {
//         root: {
//           padding: 0,
//           minHeight: 0,
//           "&.Mui-expanded": {
//             minHeight: "auto"
//           },
//           ".MuiAccordionSummary-content": {
//             margin: 0
//           },
//           ".MuiAccordionSummary-content.Mui-expanded": {
//             margin: 0
//           }
//         }
//       }
//     },
//     MuiAccordionDetails: {
//       styleOverrides: {
//         root: {
//           paddingLeft: 0,
//           paddingRight: 0
//         }
//       }
//     },
//     MuiRating: {
//       styleOverrides: {
//         root: {
//           color: "#FFD600"
//         }
//       }
//     },
//     MuiTableBody: {
//       styleOverrides: {
//         root: {
//           "& .MuiTableRow-root:last-of-type": {
//             "& .MuiTableCell-root": {
//               borderBottom: 0
//             }
//           }
//         }
//       }
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           color: "#94A4C4",
//           textTransform: "none",
//           fontSize: 12,
//           fontWeight: 600,
//           padding: 0,
//           minWidth: "auto",
//           marginLeft: "1rem",
//           marginRight: "1rem"
//         }
//       }
//     },
//     MuiTabs: {
//       styleOverrides: {
//         root: {
//           "& .MuiButtonBase-root:first-of-type": {
//             marginLeft: 0
//           },
//           "& .MuiButtonBase-root:last-of-type": {
//             marginRight: 0
//           }
//         }
//       }
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           "&:hover": {
//             backgroundColor: "transparent"
//           }
//         }
//       }
//     },
//     MuiPopover: {
//       styleOverrides: {
//         root: {
//           "& .MuiPopover-paper": {
//             boxShadow: "none",
//             borderRadius: "8px",
//             border: "2px solid #E5EAF2"
//           }
//         }
//       }
//     },
//     MuiTabPanel: {
//       styleOverrides: {
//         root: {
//           padding: 0
//         }
//       }
//     },
//     MuiButtonBase: {
//       styleOverrides: {
//         root: {
//           fontFamily: "'Montserrat', sans-serif"
//         }
//       }
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& input::placeholder": {
//             color: secondary[400],
//             opacity: 1
//           },
//           "& label": {
//             color: secondary[400],
//             opacity: 1,
//             fontWeight: 500
//           }
//         }
//       }
//     }
//   },
//   typography: {
//     button: {
//       fontWeight: 600
//     },
//     fontFamily: "'Montserrat', sans-serif",
//     h1: {
//       fontWeight: 800,
//       fontSize: "4.25rem"
//     },
//     h2: {
//       fontWeight: 600,
//       fontSize: "4rem"
//     },
//     h3: {
//       fontWeight: 600,
//       fontSize: "2.25rem"
//     },
//     h4: {
//       fontWeight: 600,
//       fontSize: "2rem"
//     },
//     h5: {
//       fontWeight: 600,
//       fontSize: "1.5rem"
//     },
//     h6: {
//       fontWeight: 600,
//       fontSize
//     },
//     overline: {
//       fontWeight: 600
//     },
//     body1: {
//       fontSize
//     },
//     body2: {
//       fontSize
//     }
//   }
// };
// const themesOptions = {
//   [THEMES.LIGHT]: {
//     palette: {
//       primary,
//       secondary,
//       error,
//       warning,
//       success,
//       info,
//       divider: secondary[300],
//       background: {
//         default: "#f3f4f9"
//       },
//       text: {
//         primary: secondary[500],
//         secondary: secondary[300],
//         disabled: secondary[400]
//       },
//       mode: "light"
//     },
//     components: {
//       MuiCard: {
//         styleOverrides: {
//           root: {
//             boxShadow: "none",
//             border: "1px solid #E5EAF2",
//             borderRadius: 8
//           }
//         }
//       }
//     }
//   },
//   [THEMES.DARK]: {
//     palette: {
//       primary,
//       error,
//       warning,
//       success,
//       info,
//       background: {
//         default: "#1e2732",
//         paper: "#222b36"
//       },
//       mode: "dark"
//     },
//     components: {
//       MuiTableCell: {
//         styleOverrides: {
//           root: {
//             border: "none"
//           }
//         }
//       },
//       MuiPopover: {
//         styleOverrides: {
//           root: {
//             "& .MuiPopover-paper": {
//               border: "1px solid rgba(255, 255, 255, 0.12)"
//             }
//           }
//         }
//       }
//     }
//   }
// };
// export const ukoTheme = config => {
//   let themeOption = themesOptions[config.theme];

//   if (!themeOption) {
//     console.warn(new Error(`The theme ${config.theme} is not valid`));
//     themeOption = themesOptions[THEMES.LIGHT];
//   } //@ts-ignore

//   const merged = merge({}, baseOptions, themeOption, {
//     direction: config.direction
//   }); //@ts-ignore

//   let theme = createTheme(merged);

//   if (config.responsiveFontSizes) {
//     theme = responsiveFontSizes(theme);
//   } // theme shadows

//   theme.shadows[1] = "0px 4px 23px rgba(0, 0, 0, 0.12)";
//   theme.shadows[2] = "0px 0px 21px 1px rgba(0, 0, 0, 0.07)";
//   theme.shadows[3] = "0px 10px 30px rgba(0, 0, 0, 0.1)";
//   theme.shadows[4] = "0px 7px 30px 3px rgba(0, 0, 0, 0.05)"; // console.log(theme);

//   return theme;
// };

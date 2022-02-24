import PropTypes from "prop-types";
import CustomBox from "../../components/CustomBox";
import CustomTypography from "../../components/CustomTypography";
// import Footer from "../../layout/common/Footer";
// import colors from "../../theme/base/colors";

const CoverLayout = ({ motto, premotto, image, cardContent, children }) => {
  //   const { gradients } = colors;
  return (
    <CustomBox
      width="100vw"
      maxWidth="100%"
      height="100%"
      minHeight="100vh"
      sx={({
        functions: { tripleLinearGradient },
        palette: { gradients },
      }) => ({
        overflowX: "hidden",
        backgroundImage: tripleLinearGradient(
          gradients.cover.main,
          gradients.cover.state,
          gradients.cover.stateSecondary,
          gradients.cover.deg
        ),
        position: "relative",
      })}
    >
      <CustomBox
        height="100%"
        width="50vw"
        display={{ xs: "none", md: "block" }}
        position="absolute"
        top={0}
        left={0}
        sx={({ breakpoints }) => ({
          overflow: "hidden",
          [breakpoints.down("xl")]: {
            mr: "100px",
          },
          [breakpoints.down("lg")]: {
            display: "none",
          },
        })}
        zIndex={0}
      >
        <CustomBox
          height="100%"
          sx={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <CustomTypography
            textAlign={cardContent ? "center" : "start"}
            variant="subtitle1"
            fontWeight="medium"
            color="white"
            mb="10px"
            sx={{ mb: 1, letterSpacing: "8px" }}
          >
            {premotto}
          </CustomTypography>
          <CustomTypography
            textAlign={cardContent ? "center" : "start"}
            variant="h2"
            fontWeight="bold"
            color="white"
            mb="10px"
            textGradient
            sx={{ letterSpacing: "8px" }}
          >
            {motto}
          </CustomTypography>
        </CustomBox>
      </CustomBox>
      {/* second box */}
      <CustomBox
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          alignItems: "center",
          maxWidth: "1044px",
          minHeight: "75vh",
          margin: "0 auto",
          maxHeight: "100vh",
        }}
      >
        <CustomBox
          //   mt={top}
          ml="auto !important"
          sx={({ breakpoints }) => ({
            height: "100%",
            [breakpoints.down("xl")]: {
              mr: cardContent ? "50px" : "100px",
            },
            [breakpoints.down("lg")]: {
              mr: "auto",
              ml: "auto !important",
            },
            [breakpoints.down("md")]: {
              maxWidth: "90%",
              pr: "7px",
              pl: "10px !important",
            },
          })}
        >
          <CustomBox
            px={3}
            mb="50px"
            mx="auto"
            ml="auto !important"
            sx={({ breakpoints }) => ({
              mt: "60px",
              maxWidth: cardContent ? "450px" : "350px",
              [breakpoints.down("xl")]: {
                mr: cardContent ? "0px" : "100px",
              },
              [breakpoints.only("lg")]: {
                mr: "auto",
                ml: "auto !important",
              },
              [breakpoints.down("lg")]: {
                mr: "auto",
                ml: "auto !important",
              },
              [breakpoints.down("md")]: {
                mr: cardContent ? "auto !important" : "unset",
                pr: "7px",
                pl: cardContent ? "0px !important" : "10px !important",
              },
            })}
          >
            {children}
          </CustomBox>
          {/* <Footer /> */}
        </CustomBox>
      </CustomBox>
    </CustomBox>
  );
};

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  color: "info",
  top: 20,
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  top: PropTypes.number,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;

import React from "react";
import CustomButton from "../components/CustomButton";
import PropTypes from "prop-types";

const ButtonGroups = ({
  value1 = "Cancel",
  handler1 = () => {},
  value2 = "Proceed",
  handler2 = () => {},
  classes = "mt-0",
  alignment = "text-end",
}) => {
  return (
    <div className={`${classes} ${alignment}`}>
      <CustomButton variant="outlined" className="me-2" onClick={handler1}>
        {value1}
      </CustomButton>
      <CustomButton color="info" variant="gradient" onClick={handler2}>
        {value2}
      </CustomButton>
    </div>
  );
};

export default ButtonGroups;

ButtonGroups.propTypes = {
  value1: PropTypes.string,
  handler1: PropTypes.func,
  value2: PropTypes.string,
  handler2: PropTypes.func,
  classes: PropTypes.string,
  alignment: PropTypes.string,
  // size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
};

import { Box } from "@mui/material";

const CustomFlexbox = ({ children, ...props }) => (
  <Box display="flex" {...props}>
    {children}
  </Box>
);

export default CustomFlexbox;

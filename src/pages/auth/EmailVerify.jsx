import React, { useEffect, useState } from "react";
import { Button, Container, Paper, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { error, success } from "../../theme/themeColors";

const EmailVerify = () => {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("200");

  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res) => {
      //   console.log(res);
      if (res.status === "200") {
        setMessage("Verified Sucessfully");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setStatus(res.status);
        setMessage("Verification Failed");
      }
    });
  }, [id, navigate]);

  return (
    <Container>
      <Paper elevation={4}>
        <CustomTypoDisplay status={status === "200"}>
          {message}
        </CustomTypoDisplay>
      </Paper>
    </Container>
  );
};

export default EmailVerify;

export const CustomTypoDisplay = ({ status, children }) => {
  return (
    <>
      <Typography
        align="center"
        bgcolor={status ? success.main : error.main}
        color={"#FFFFFF"}
        sx={{
          mt: 1,
          borderRadius: ".5em",
          px: 1.5,
          py: 1,
        }}
      >
        {children}
      </Typography>
      <Link>
        <Button variant="contained" fullWidth sx={{ mt: 1 }}>
          Go to Home
        </Button>
      </Link>
    </>
  );
};

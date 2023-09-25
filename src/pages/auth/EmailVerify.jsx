import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import AuthContainer from "../../layout/auth/AuthContainer";
import Img from "../../assets/illustrations/illustration-verification.jpg";
import MDButton from "../../components/MDButton";

const EmailVerify = () => {
  const { id } = useParams();

  const [message, setMessage] = useState("");
  // const [status, setStatus] = useState("200");

  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res) => {
      //   console.log(res);
      if (res.status === "200") {
        setMessage("Verified Sucessfully !");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // setStatus(res.status);
        setMessage("Verification Failed !");
      }
    });
  }, [id, navigate]);

  return (
    <AuthContainer title={message} illustration={Img}>
      <Link to="/">
        <MDButton variant="gradient" color="info" fullWidth sx={{ mt: 1 }}>
          Go to Home
        </MDButton>
      </Link>
    </AuthContainer>
  );
};

export default EmailVerify;

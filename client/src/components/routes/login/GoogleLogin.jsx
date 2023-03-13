import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import { googleRegister, googleLogin } from "../../api/user";

const GoogleLogin = ({ method }) => {
  const navigate = useNavigate();

  const handleGoogleAccess = useGoogleLogin({
    onSuccess: async (googleAccessToken) => {
      if (method === "sign-up") {
        const { googleRegisterToken } = await googleRegister(googleAccessToken);

        if (googleRegisterToken) {
          const isSuccess = await googleLogin(googleRegisterToken);

          if (isSuccess) navigate("/");
        }
      }

      if (method === "login") {
        const isSuccess = await googleLogin(googleAccessToken);

        if (isSuccess) navigate("/");
      }
    },
  });

  return (
    <>
      <hr className="my-1" />
      <p className="mb-4 text-center">Or {method} with</p>
      <button
        className="google btn btn-outline-dark position-relative translate-middle"
        onClick={() => handleGoogleAccess()}
      >
        <img
          className="me-2"
          width="20"
          src="https://img.icons8.com/color/48/null/google-logo.png"
        />
        Google
      </button>
    </>
  );
};

export default GoogleLogin;

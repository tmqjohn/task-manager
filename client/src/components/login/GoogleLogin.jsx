import React from "react";

const GoogleLogin = ({ formText }) => {
  return (
    <>
      <hr className="my-1" />
      <p className="mb-4 text-center">Or {formText} with</p>
      <button className="google btn btn-outline-dark position-relative translate-middle">
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

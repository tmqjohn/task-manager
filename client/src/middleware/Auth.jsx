import React from "react";
import { Navigate } from "react-router-dom";

const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={"/"} replace={true} />;
  }

  return children;
};

export { AuthorizeUser, ProtectedRoute };

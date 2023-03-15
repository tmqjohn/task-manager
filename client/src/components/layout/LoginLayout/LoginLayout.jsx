import React from "react";
import { Outlet } from "react-router-dom";

const Login = () => {
  return (
    <div className="position-absolute shadow rounded top-50 start-50 translate-middle">
      <main className="login-form d-flex">
        <div className="login-left-panel rounded-start"></div>
        <div className="login-right-panel py-3 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Login;

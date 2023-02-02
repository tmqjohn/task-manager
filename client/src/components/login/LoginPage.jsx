import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// utils
import { loginUser } from "../../helpers/helper";

//components
import GoogleLogin from "./GoogleLogin";

import "./styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const inputUser = useRef();
  const inputPass = useRef();

  function submit(e) {
    loginUser(e, inputUser, inputPass, navigate);
  }

  return (
    <div className="login-page-form">
      <span className="material-symbols-outlined">local_florist</span>

      <h1 className="mt-2 mb-5">Login</h1>

      <form autoComplete="off" onSubmit={submit}>
        <div className="login form-floating">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            ref={inputUser}
            required
          />
          <label htmlFor="floatingInput">Username</label>
        </div>

        <div className="login form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            ref={inputPass}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-3"
          type="submit"
        >
          Login
        </button>
      </form>

      <GoogleLogin formText={"login"} />

      <p className="mt-2 text-center">
        Don't have an account?{" "}
        <Link className="text-decoration-none" to="/auth/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

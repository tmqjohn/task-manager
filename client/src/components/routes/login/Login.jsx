import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// utils
import { loginUser } from "../../api/user";

//components
import GoogleLogin from "./GoogleLogin";

import "./styles/login.css";

const LoginPage = () => {
  const inputUser = useRef();
  const inputPass = useRef();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const isSuccess = await loginUser(inputUser, inputPass);
    if (isSuccess) navigate("/");
  }

  return (
    <div className="login-page-form">
      <span className="material-symbols-outlined">local_florist</span>

      <h1 className="mb-5">Login</h1>

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

        <div className="login form-floating mb-2">
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

        <Link className="text-decoration-none" to="/auth/login/username">
          Forgot your password?
        </Link>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-2"
          type="submit"
        >
          Login
        </button>
      </form>

      <GoogleLogin formText={"login"} />

      <p className="mt-2 text-center">
        Don't have an account?{" "}
        <Link className="text-decoration-none" to="/auth/login/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

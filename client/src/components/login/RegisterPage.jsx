import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// utils
import { registerUser } from "../../helpers/helper";

//components
import GoogleLogin from "./GoogleLogin";

import "./styles/login.css";

const Register = () => {
  const navigate = useNavigate();

  const inputUser = useRef();
  const inputPass = useRef();
  const inputName = useRef();
  const inputEmail = useRef();

  const credentials = {
    inputUser,
    inputPass,
    inputName,
    inputEmail,
  };

  function submit(e) {
    registerUser(e, credentials, navigate);
  }

  return (
    <div className="register-page-form">
      <Link to="/auth/login">
        <span className="text-muted material-symbols-outlined">arrow_back</span>
      </Link>

      <h1 className="my-2">Register</h1>

      <form autoComplete="off" onSubmit={submit}>
        <div className="full-name form-floating">
          <input
            type="text"
            className="form-control"
            id="fullName"
            placeholder="Full Name"
            ref={inputName}
            required
          />
          <label htmlFor="fullName">Full Name</label>
        </div>

        <div className="register form-floating">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            ref={inputUser}
            required
          />
          <label htmlFor="username">Username</label>
        </div>

        <div className="register form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            ref={inputPass}
            required
          />
          <label htmlFor="password">Password</label>
        </div>

        <div className="mb-1 form-floating">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="email@sample.com"
            ref={inputEmail}
            required
          />
          <label htmlFor="email">Email</label>
        </div>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-2"
          type="submit"
        >
          Sign-up
        </button>
      </form>

      <GoogleLogin formText={"sign-up"} />
    </div>
  );
};

export default Register;

import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// utils
import { registerUser } from "../../api/user";

//components
import GoogleLogin from "./GoogleLogin";

const Register = () => {
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

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const isSuccess = await registerUser(credentials);

    if (isSuccess) {
      toast.dismiss();
      toast.success("Registration successful!");
      toast.success("Try logging into your account");

      navigate("/auth/login");
    }
  }

  return (
    <div className="register-page-form">
      <Link to="/auth/login">
        <span className="text-muted material-symbols-outlined">arrow_back</span>
      </Link>

      <h1 className="mb-3">Register</h1>

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

      <GoogleLogin method={"sign-up"} />
    </div>
  );
};

export default Register;

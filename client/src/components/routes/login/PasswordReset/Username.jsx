import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { generateOtp } from "../../../api/recovery";

const Username = () => {
  const navigate = useNavigate();
  const inputUsername = useRef();

  async function submit(e) {
    e.preventDefault();

    const isSuccess = await generateOtp(inputUsername.current.value);

    if (isSuccess) {
      toast.dismiss();
      toast.success(isSuccess.message);

      navigate(`/auth/login/otp/${inputUsername.current.value}`);
    }
  }

  return (
    <div className="username-page-form">
      <Link to="/auth/login">
        <span className="text-muted material-symbols-outlined">arrow_back</span>
      </Link>

      <h1 className="mb-2">Verify Username</h1>
      <h6 className="text-secondary mt-3">
        An email will be sent to your registered email address
      </h6>

      <form autoComplete="off" onSubmit={submit}>
        <div className="username form-floating mt-4">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            ref={inputUsername}
            required
          />
          <label htmlFor="username">Username</label>
        </div>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-4"
          type="submit"
        >
          Send Verification Code
        </button>
      </form>
    </div>
  );
};

export default Username;

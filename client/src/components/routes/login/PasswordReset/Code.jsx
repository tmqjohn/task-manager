import React, { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { verifyOtp } from "../../../api/recovery";

const OTP = () => {
  const navigate = useNavigate();
  const inputCode = useRef();
  const { username } = useParams();

  async function submit(e) {
    e.preventDefault();

    const isSuccess = await verifyOtp(inputCode.current.value);

    if (isSuccess) {
      toast.dismiss();
      toast.success(isSuccess.message);

      navigate(`/auth/login/passwordreset/${username}`);
    }
  }

  return (
    <div className="code-page-form">
      <Link to="/auth/login/username">
        <span className="text-muted material-symbols-outlined">arrow_back</span>
      </Link>

      <h1 className="mb-2">Verify Code</h1>
      <h6 className="text-secondary mt-3">
        Enter the password recovery code you received from your email
      </h6>

      <form autoComplete="off" onSubmit={submit}>
        <div className="code form-floating mt-4">
          <input
            type="text"
            className="form-control"
            id="code"
            placeholder="Code"
            ref={inputCode}
            required
          />
          <label htmlFor="code">Code</label>
        </div>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-4"
          type="submit"
        >
          Verify Code
        </button>
      </form>
    </div>
  );
};

export default OTP;

import React, { useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { resetPassword } from "../../../api/recovery";

const PasswordReset = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const newPasswordInput = useRef();
  const confirmPasswordInput = useRef();

  async function submit(e) {
    e.preventDefault();

    if (newPasswordInput.current.value != confirmPasswordInput.current.value) {
      newPasswordInput.current.focus;
      newPasswordInput.current.value = "";
      confirmPasswordInput.current.value = "";

      toast.dismiss();
      return toast.error("Passwords do not match");
    }

    const isSuccess = await resetPassword(
      username,
      newPasswordInput.current.value
    );

    if (isSuccess) {
      toast.dismiss();
      toast.success(isSuccess.message);

      navigate("/auth/login");
    }
  }

  return (
    <div className="reset-page-form">
      <Link to="/auth/login/">
        <span className="text-muted material-symbols-outlined">arrow_back</span>
      </Link>

      <h1 className="mb-4">Change Password</h1>

      <form autoComplete="off" onSubmit={submit}>
        <div className="reset form-floating">
          <input
            type="password"
            className="new-password form-control"
            id="newPassword"
            placeholder="New Password"
            ref={newPasswordInput}
            required
          />
          <label htmlFor="newPassword">New Password</label>
        </div>

        <div className="reset form-floating mb-2">
          <input
            type="password"
            className="confirm-password form-control"
            id="confirmPassword"
            placeholder="Confirm Password"
            ref={confirmPasswordInput}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>

        <button
          className="btn btn-lg btn-primary btn-login w-100 my-3"
          type="submit"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;

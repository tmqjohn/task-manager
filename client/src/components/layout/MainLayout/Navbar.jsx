import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

import { logoutUser } from "../../api/user";
import { useUserStore, useGoogleStore } from "../../../store/store";

import Profile from "../../routes/root/Profile";

const Navbar = () => {
  const { userDetails, clearUserDetails } = useUserStore((state) => ({
    userDetails: state.userDetails,
    clearUserDetails: state.clearUserDetails,
  }));
  const clearAccessToken = useGoogleStore((state) => state.clearAccessToken);

  const [defaultProfileInputs, setDefaultProfileInputs] = useState(false);

  const navigate = useNavigate();

  function logout() {
    logoutUser();
    clearUserDetails();
    clearAccessToken();
    googleLogout();
    navigate("/auth/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom ">
        <a className="navbar-brand" href="/">
          Task Manager
        </a>
        <div className="d-flex align-items-center ms-auto">
          <h6 className="main-section-title px-3">
            Good day, {userDetails?.fullName}!
          </h6>
          <button
            className="btn border-0 border-end border-start"
            data-bs-toggle="modal"
            data-bs-target="#profilePrompt"
            onClick={() => setDefaultProfileInputs((prev) => !prev)}
          >
            <img src="/profile.svg" /> Profile
          </button>
          <button className="btn border-0" onClick={logout}>
            <img src="/logout.svg" /> Logout
          </button>
        </div>
      </nav>

      {/* profile pop-up */}
      <Profile defaultProfileInputs={defaultProfileInputs} />
    </>
  );
};

export default Navbar;

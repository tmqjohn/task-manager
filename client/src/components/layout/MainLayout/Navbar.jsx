import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../api/user";
import { useUserStore, useGoogleStore } from "../../../store/store";

import Profile from "../../routes/root/Profile";

const Navbar = () => {
  const clearUserDetails = useUserStore((state) => state.clearUserDetails);
  const clearAccessToken = useGoogleStore((state) => state.clearAccessToken);

  const [defaultProfileInputs, setDefaultProfileInputs] = useState(false);

  const navigate = useNavigate();

  function logout() {
    logoutUser();
    clearUserDetails();
    clearAccessToken();
    navigate("/auth/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom ">
        <a className="navbar-brand" href="/">
          Task Manager
        </a>
        <div className="d-flex ms-auto">
          <button
            className="btn border-0"
            data-bs-toggle="modal"
            data-bs-target="#profilePrompt"
            onClick={() => setDefaultProfileInputs((prev) => !prev)}
          >
            <img src="/profile.svg" /> Profile
          </button>
          <div className="border-end"></div>
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { logoutUser } from "../../api/user";
import { useUserStore } from "../../../store/store";

import Profile from "../../routes/root/Profile";

const Navbar = () => {
  const { clearUserDetails } = useUserStore(
    (state) => ({
      userDetails: state.userDetails,
      clearUserDetails: state.clearUserDetails,
    }),
    shallow
  );

  const navigate = useNavigate();

  const [defaultProfileInputs, setDefaultProfileInputs] = useState(false);

  function logout() {
    logoutUser();
    clearUserDetails();
    navigate("/auth/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom ">
        <a className="navbar-brand" href="/">
          Task Manager
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
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

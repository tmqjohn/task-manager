import React from "react";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";

import Profile from "../../routes/root/Profile";

import { logoutUser } from "../../api/user";
import { useUserStore } from "../../../store/store";

const Navbar = () => {
  const navigate = useNavigate();
  const { userDetails, clearUserDetails } = useUserStore(
    (state) => ({
      userDetails: state.userDetails,
      clearUserDetails: state.clearUserDetails,
    }),
    shallow
  );
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
        <div className="collapse navbar-collapse" id="navbarDropdown">
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item"> */}
            {/* TODO: replace word with image for notifications panel */}
            {/* <a className="nav-link" href="#footer"> */}
            {/* Notifications */}
            {/* </a> */}
            {/* </li> */}

            {/* drop down for logout and profile */}
            <div className="dropdown dropstart">
              <button
                className="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Hi, {userDetails?.fullName}!
              </button>
              <ul className="dropdown-menu dropdown-menu-start w-10">
                {/* TODO: insert offcanvas for profile viewing */}
                <li>
                  <button
                    className="btn dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#profilePrompt"
                  >
                    Profile
                  </button>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <button className="btn dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </nav>

      {/* profile pop-up */}
      <Profile />
    </>
  );
};

export default Navbar;

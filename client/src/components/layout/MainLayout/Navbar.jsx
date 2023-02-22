import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { logoutUser } from "../../api/user";
import { useUserStore } from "../../../store/store";

import Profile from "../../routes/root/Profile";

const Navbar = () => {
  const { userDetails, clearUserDetails } = useUserStore(
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
        <div className="collapse navbar-collapse" id="navbarDropdown">
          <ul className="navbar-nav ms-auto">
            <div className="dropdown dropstart">
              <button
                className="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Hi, {userDetails?.fullName}!
              </button>
              <ul className="dropdown-menu dropdown-menu-start w-10">
                <li>
                  <button
                    className="btn dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#profilePrompt"
                    onClick={() => setDefaultProfileInputs((prev) => !prev)}
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
      <Profile defaultProfileInputs={defaultProfileInputs} />
    </>
  );
};

export default Navbar;

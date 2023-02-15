import React, { useEffect, useRef } from "react";

import { useUserStore } from "../../../store/store";
import { getUserDetails, updateUser } from "../../api/user";

const Profile = () => {
  const { userDetails, setUserDetails } = useUserStore((state) => ({
    userDetails: state.userDetails,
    setUserDetails: state.setUserDetails,
  }));

  const passwordInput = useRef();
  const fullNameInput = useRef();
  const emailInput = useRef();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setUserDetails(await getUserDetails());
    };

    fetchUserDetails();
  }, []);

  async function update() {
    await updateUser(userDetails._id, emailInput, fullNameInput, passwordInput);

    setUserDetails(await getUserDetails());

    passwordInput.current.value = "";
  }

  return (
    <div
      className="modal fade"
      id="profilePrompt"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Profile</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form autoComplete="off">
              <section className="mb-3">
                <label htmlFor="username" className="col-form-label">
                  Username:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  defaultValue={userDetails?.username}
                  disabled
                />
              </section>
              <section className="mb-3">
                <label htmlFor="password" className="col-form-label">
                  Password:
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  ref={passwordInput}
                />
              </section>
              <section className="mb-3">
                <label htmlFor="fullname" className="col-form-label">
                  Full Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullname"
                  defaultValue={userDetails?.fullName}
                  ref={fullNameInput}
                  required
                />
              </section>
              <section className="mb-3">
                <label htmlFor="email" className="col-form-label">
                  Email:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  defaultValue={userDetails?.email}
                  ref={emailInput}
                  required
                />
              </section>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={update}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

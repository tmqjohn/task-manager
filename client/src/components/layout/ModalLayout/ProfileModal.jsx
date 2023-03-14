import React, { useRef, useEffect, useState } from "react";

const ProfileModal = ({
  id,
  title,
  inputId,
  updateProfile,
  userDetails,
  defaultProfileInputs,
}) => {
  const usernameInput = useRef();
  const passwordInput = useRef();
  const fullNameInput = useRef();
  const emailInput = useRef();
  const closeBtnRef = useRef();

  const [disableForm, setDisableForm] = useState();

  useEffect(() => {
    if (userDetails.username != userDetails.googleId) {
      usernameInput.current.value = userDetails.username;
      setDisableForm(false);
    }

    if (userDetails.username === userDetails.googleId) {
      usernameInput.current.value = "";
      setDisableForm(true);
    }

    passwordInput.current.value = "";
    fullNameInput.current.value = userDetails.fullName;
    emailInput.current.value = userDetails.email;
  }, [defaultProfileInputs, disableForm]);

  async function handleSubmit() {
    updateProfile(
      passwordInput.current.value,
      fullNameInput.current.value,
      emailInput.current.value,
      closeBtnRef
    );
  }

  const formControls = (
    <>
      <div className="modal-body">
        <section className="mb-3">
          <label htmlFor={inputId.username} className="col-form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id={inputId.username}
            ref={usernameInput}
            disabled
          />
        </section>
        <section className="mb-3">
          <label htmlFor={inputId.password} className="col-form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id={inputId.password}
            ref={passwordInput}
          />
        </section>
        <section className="mb-3">
          <label htmlFor={inputId.fullName} className="col-form-label">
            Full Name:
          </label>
          <input
            type="text"
            className="form-control"
            id={inputId.fullName}
            ref={fullNameInput}
            required
          />
        </section>
        <section className="mb-3">
          <label htmlFor={inputId.email} className="col-form-label">
            Email:
          </label>
          <input
            type="text"
            className="form-control"
            id={inputId.email}
            ref={emailInput}
            required
          />
        </section>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          ref={closeBtnRef}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
    </>
  );

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">{title}</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            {disableForm ? (
              <fieldset disabled>{formControls}</fieldset>
            ) : (
              formControls
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

import React from "react";

const GroupsModal = ({
  id,
  title,
  inputId,
  inputTitleRef,
  closeBtnRef,
  submitFunction,
  submitBtnLabel,
}) => {
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
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              submitFunction;
            }}
          >
            <div className="modal-body">
              <label htmlFor={inputId} className="col-form-label">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                id={inputId}
                ref={inputTitleRef}
                required
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeBtnRef}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={submitFunction}
              >
                {submitBtnLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupsModal;

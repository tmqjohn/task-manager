import React from "react";

const ConfirmModal = ({
  id,
  title,
  body,
  submitFunction,
  optionalClose = false,
  optionalCloseTarget,
  optionalFunction,
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
          <div className="modal-body">{body}</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss={optionalClose ? null : "modal"}
              data-bs-target={optionalClose ? optionalCloseTarget : null}
              data-bs-toggle={optionalClose ? "modal" : null}
              onClick={optionalClose ? optionalFunction : null}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={submitFunction}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

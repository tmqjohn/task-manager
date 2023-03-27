import React from "react";

const ProjectModal = ({
  id,
  title,
  inputId,
  inputRef,
  handleCreate,
  handleEdit,
  submitBtnLabel,
  isLoading,
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

          <div className="modal-body">
            <section className="mb-3">
              <label htmlFor={inputId.title} className="col-form-label">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                id={inputId.title}
                ref={inputRef.titleInput}
                autoComplete="off"
                required
              />
            </section>

            <section className="mb-3">
              <label htmlFor={inputId.desc} className="col-form-label">
                Description:
              </label>
              <input
                type="text"
                className="form-control"
                id={inputId.desc}
                ref={inputRef.descInput}
                autoComplete="off"
              />
            </section>
          </div>
          <div className="modal-footer">
            {isLoading ? (
              <div
                className="spinner-border text-secondary me-auto"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : null}

            {handleEdit ? (
              <button
                type="button"
                className="btn btn-danger me-auto"
                data-bs-target="#confirmDeletePrompt"
                data-bs-toggle="modal"
              >
                Delete Project
              </button>
            ) : null}

            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              ref={inputRef.closeBtnRef}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={
                handleCreate
                  ? async (e) => await handleCreate(e)
                  : async () => await handleEdit()
              }
            >
              {submitBtnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

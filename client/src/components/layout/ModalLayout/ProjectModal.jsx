import React from "react";

const ProjectModal = ({
  id,
  title,
  inputId,
  inputRef,
  handleCreate,
  handleEdit,
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

            {/* <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <section>
                <label htmlFor={inputId.owners} className="col-form-label">
                  Owners:
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    id={inputId.owners}
                    placeholder="Search by username"
                    ref={inputRef.searchOwnerInput}
                  />
                  <button
                    className="btn ms-auto p-0"
                    onClick={async () => await submitFunctions.addOwner()}
                  >
                    <img src="/add_big.svg" />
                  </button>
                </div>

                <ul className="list-group list-group-flush mt-1 mb-0">
                  {owner}
                  {ownerList}
                </ul>
              </section>
            </form> */}

            {/* <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <section>
                <label htmlFor={inputId.members} className="col-form-label">
                  Members:
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    id={inputId.members}
                    placeholder="Search by username"
                    ref={inputRef.searchMemberInput}
                  />
                  <button
                    className="btn ms-auto p-0"
                    onClick={async () => await submitFunctions.addMember()}
                  >
                    <img src="/add_big.svg" />
                  </button>
                </div>

                <ul className="list-group list-group-flush mt-1 mb-0">
                  {memberList}
                </ul>
              </section>
            </form> */}
          </div>
          <div className="modal-footer">
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

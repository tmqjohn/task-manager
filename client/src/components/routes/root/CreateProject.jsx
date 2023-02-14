import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { getUserDetails, getUserId } from "../../api/user";

import { useProjectStore } from "../../../store/store";

const CreateProject = () => {
  const { projects, setProject } = useProjectStore((state) => ({
    projects: state.projects,
    setProject: state.setProject,
  }));
  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const titleInput = useRef();
  const descInput = useRef();
  const searchInput = useRef();
  const closeButton = useRef();

  const navigate = useNavigate();

  async function submitCreate(e) {
    e.preventDefault();

    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    const projectId = await createProject(
      titleInput.current.value,
      descInput.current.value,
      [getUserId(true)],
      membersId
    );

    if (projectId) {
      setProject([...projects, projectId]);
      navigate(`/project/${projectId._id}`);

      closeButton.current.click();
    }
  }

  async function addMember() {
    let searchValue = searchInput.current.value;

    if (searchValue) {
      const foundUser = await getUserDetails(searchValue);

      if (!foundUser.message) {
        if (members.includes(foundUser.fullName)) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("User is already added in the project");
        }

        if (searchValue === getUserId(false).username) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("Owner cannot be added as member");
        }

        searchInput.current.value = "";
        searchInput.focus;

        setMembers([...members, foundUser.fullName]);
        setMembersId([...membersId, foundUser._id]);
      } else {
        searchInput.focus;

        toast.dismiss();
        return toast.error(foundUser.message);
      }
    }
  }

  function removeMember(e) {
    const removeMember = e.target.offsetParent.innerText;
    const removeMemberId = membersId[members.indexOf(removeMember)];

    setMembers((prev) => prev.filter((member) => member != removeMember));
    setMembersId((prev) =>
      prev.filter((memberId) => memberId != removeMemberId)
    );
  }

  const memberList = members.map((member, i) => (
    <li className="list-group-item" key={i}>
      <button className="btn p-0" onClick={(e) => removeMember(e)}>
        <img src="/remove.svg" />
      </button>
      {member}
    </li>
  ));

  return (
    <div
      className="modal fade"
      id="createProjectPrompt"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Create Project</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <section className="mb-3">
                <label htmlFor="project-title" className="col-form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="project-title"
                  ref={titleInput}
                />
              </section>
              <section className="mb-3">
                <label htmlFor="project-description" className="col-form-label">
                  Description:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="project-description"
                  ref={descInput}
                />
              </section>
            </form>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <section>
                <label htmlFor="project-members" className="col-form-label">
                  Members:
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    id="project-members-search"
                    placeholder="Search by username"
                    ref={searchInput}
                  />
                  <button className="btn ms-auto p-0" onClick={addMember}>
                    <img src="/add.svg" />
                  </button>
                </div>

                <ul className="list-group list-group-flush mt-1 mb-0">
                  {memberList}
                </ul>
              </section>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              ref={closeButton}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitCreate}
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;

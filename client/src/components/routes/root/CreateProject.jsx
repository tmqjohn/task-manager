import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { getUserDetails } from "../../api/user";

import { useProjectStore } from "../../../store/store";
import { useUserStore } from "../../../store/store";

const CreateProject = () => {
  const { projects, setProject } = useProjectStore((state) => ({
    projects: state.projects,
    setProject: state.setProject,
  }));
  const userDetails = useUserStore((state) => state.userDetails);

  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ownersId, setOwnersId] = useState([]);

  const titleInput = useRef();
  const descInput = useRef();
  const searchMemberInput = useRef();
  const searchOwnerInput = useRef();
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
      [userDetails._id],
      membersId
    );

    if (projectId) {
      setProject([...projects, projectId]);
      navigate(`/project/${projectId._id}`);

      closeButton.current.click();
    }
  }

  async function addUsers(searchInput, users, setUsers, setUsersId) {
    let searchValue = searchInput.current.value;

    if (searchValue) {
      const foundUser = await getUserDetails(searchValue);

      if (!foundUser.message) {
        if (users.includes(foundUser.fullName)) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("User is already added in the project");
        }

        if (searchValue === userDetails.username) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("Owner cannot be added as member");
        }

        if (owners.includes(foundUser.fullName)) {
          removeUsers(
            foundUser.fullName,
            ownersId,
            owners,
            setOwners,
            setOwnersId
          );
        }

        if (members.includes(foundUser.fullName)) {
          removeUsers(
            foundUser.fullName,
            membersId,
            members,
            setMembers,
            setMembersId
          );
        }

        searchInput.current.value = "";
        searchInput.focus;

        setUsers([...users, foundUser.fullName]);
        setUsersId([...membersId, foundUser._id]);
      } else {
        searchInput.focus;

        toast.dismiss();
        return toast.error(foundUser.message);
      }
    }
  }

  function addOwner() {
    addUsers(searchOwnerInput, owners, setOwners, setOwnersId);
  }

  function addMember() {
    addUsers(searchMemberInput, members, setMembers, setMembersId);
  }

  function removeUsers(user, usersId, users, setusers, setUsersId) {
    const removeUser = user;
    const removeUserId = usersId[users.indexOf(removeUser)];

    setusers((prev) => prev.filter((member) => member != removeUser));
    setUsersId((prev) => prev.filter((memberId) => memberId != removeUserId));
  }

  function removeMember(e) {
    removeUsers(
      e.target.offsetParent.innerText,
      membersId,
      members,
      setMembers,
      setMembersId
    );
  }

  function removeOwner(e) {
    removeUsers(
      e.target.offsetParent.innerText,
      ownersId,
      owners,
      setOwners,
      setOwnersId
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

  const owner = (
    <li className="list-group item py-2 px-3">{userDetails.fullName}</li>
  );

  const ownerList = owners.map((owner, i) => (
    <li className="list-group-item" key={i}>
      <button className="btn p-0" onClick={(e) => removeOwner(e)}>
        <img src="/remove.svg" />
      </button>
      {owner}
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
            <section className="mb-3">
              <label htmlFor="project-title" className="col-form-label">
                Title:
              </label>
              <input
                type="text"
                className="form-control"
                id="project-title"
                ref={titleInput}
                autoComplete="off"
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
                autoComplete="off"
              />
            </section>
            <section>
              <label htmlFor="project-owners" className="col-form-label">
                Owners:
              </label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-3"
                  id="project-owners-search"
                  placeholder="Search by username"
                  ref={searchOwnerInput}
                  autoComplete="off"
                />
                <button className="btn ms-auto p-0" onClick={addOwner}>
                  <img src="/add.svg" />
                </button>
              </div>

              <ul className="list-group list-group-flush mt-1 mb-0">
                {owner}
                {ownerList}
              </ul>
            </section>
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
                  ref={searchMemberInput}
                  autoComplete="off"
                />
                <button className="btn ms-auto p-0" onClick={addMember}>
                  <img src="/add.svg" />
                </button>
              </div>

              <ul className="list-group list-group-flush mt-1 mb-0">
                {memberList}
              </ul>
            </section>
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

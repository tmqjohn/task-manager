import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useUserStore, useProjectStore } from "../../../store/store";

import { getUserDetails } from "../../api/user";
import { updateProject, deleteProject } from "../../api/projects";

const ManageProject = ({
  selectedProject,
  projectDefaults,
  setProjectDefaults,
}) => {
  const userDetails = useUserStore((state) => state.userDetails);
  const setProject = useProjectStore((state) => state.setProject);

  const [owners, setOwners] = useState([]);
  const [ownersId, setOwnersId] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);

  const titleInput = useRef();
  const descInput = useRef();
  const searchMemberInput = useRef();
  const searchOwnerInput = useRef();
  const closeButton = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    titleInput.current.value = selectedProject[0]?.title;
    descInput.current.value = selectedProject[0]?.desc;
    searchMemberInput.current.value = "";
    searchOwnerInput.current.value = "";

    setOwners(selectedProject[0]?.ownerName);
    setOwnersId(selectedProject[0]?.owner);
    setMembers(selectedProject[0]?.membersName);
    setMembersId(selectedProject[0]?.members);
  }, [projectDefaults]);

  async function addUsers(searchInput, users, usersId, setUsers, setUsersId) {
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
        setUsersId([...usersId, foundUser._id]);
      } else {
        searchInput.focus;

        toast.dismiss();
        return toast.error(foundUser.message);
      }
    }
  }

  function removeUsers(user, usersId, users, setusers, setUsersId) {
    const removeUser = user;
    const removeUserId = usersId[users.indexOf(removeUser)];

    setusers((prev) => prev.filter((member) => member != removeUser));
    setUsersId((prev) => prev.filter((memberId) => memberId != removeUserId));
  }

  function addOwner() {
    addUsers(searchOwnerInput, owners, ownersId, setOwners, setOwnersId);
  }

  function addMember() {
    addUsers(searchMemberInput, members, membersId, setMembers, setMembersId);
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

  function removeMember(e) {
    removeUsers(
      e.target.offsetParent.innerText,
      membersId,
      members,
      setMembers,
      setMembersId
    );
  }

  const ownerList = owners?.map((owner, i) =>
    owner != userDetails.fullName ? (
      <li className="list-group-item" key={i}>
        <button className="btn p-0" onClick={(e) => removeOwner(e)}>
          <img src="/remove.svg" />
        </button>
        {owner}
      </li>
    ) : (
      <li className="list-group item py-2 px-3" key={i}>
        {userDetails.fullName}
      </li>
    )
  );

  const memberList = members?.map((member, i) => (
    <li className="list-group-item" key={i}>
      <button className="btn p-0" onClick={(e) => removeMember(e)}>
        <img src="/remove.svg" />
      </button>
      {member}
    </li>
  ));

  async function handleEdit() {
    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    const updatedProjects = await updateProject(
      selectedProject[0]._id,
      titleInput.current.value,
      descInput.current.value,
      ownersId,
      membersId
    );

    if (updatedProjects) {
      setProject(updatedProjects);

      closeButton.current.click();
      toast.dismiss();
      toast.success("Project has been updated successfully!");
    }
  }

  async function handleDelete() {
    const updatedProjects = await deleteProject(
      selectedProject[0]._id,
      selectedProject[0].owner[0]
    );

    if (updatedProjects) {
      setProject(updatedProjects);
      navigate("/");

      toast.dismiss();
      toast.success("Project has been deleted successfully!");
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="manageProjectPrompt"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Manage Project</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <section className="mb-3">
                <label htmlFor="edit-project-title" className="col-form-label">
                  Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edit-project-title"
                  ref={titleInput}
                  autoComplete="off"
                />
              </section>

              <section className="mb-3">
                <label
                  htmlFor="edit-project-description"
                  className="col-form-label"
                >
                  Description:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edit-project-description"
                  ref={descInput}
                  autoComplete="off"
                />
              </section>

              <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <section>
                  <label
                    htmlFor="edit-project-owners"
                    className="col-form-label"
                  >
                    Owners:
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-3"
                      id="edit-project-owners-search"
                      placeholder="Search by username"
                      ref={searchOwnerInput}
                      autoComplete="off"
                    />
                    <button className="btn ms-auto p-0" onClick={addOwner}>
                      <img src="/add.svg" />
                    </button>
                  </div>

                  <ul className="list-group list-group-flush mt-1 mb-0">
                    {ownerList}
                  </ul>
                </section>
              </form>

              <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <section>
                  <label
                    htmlFor="edit-project-members"
                    className="col-form-label"
                  >
                    Members:
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control me-3"
                      id="edit-project-members-search"
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
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger me-auto"
                data-bs-target="#confirmDeletePrompt"
                data-bs-toggle="modal"
              >
                Delete Project
              </button>

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
                onClick={handleEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="confirmDeletePrompt"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Are you sure you want to delete your project?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">This action cannot be undone.</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-target="#manageProjectPrompt"
                data-bs-toggle="modal"
                onClick={() => setProjectDefaults((prev) => !prev)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageProject;

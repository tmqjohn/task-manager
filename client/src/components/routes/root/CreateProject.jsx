import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createProject } from "../../api/projects";
import { getUserDetails } from "../../api/user";

import { useProjectStore } from "../../../store/store";
import { useUserStore } from "../../../store/store";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";

const CreateProject = ({ clearInputs }) => {
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
  const closeBtnRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    setMembers([]);
    setMembersId([]);
    setOwners([]);
    setOwnersId([]);

    titleInput.current.value = "";
    descInput.current.value = "";
    searchMemberInput.current.value = "";
    searchOwnerInput.current.value = "";
  }, [clearInputs]);

  async function handleCreate(e) {
    e.preventDefault();

    if (!titleInput.current.value) {
      toast.dismiss();
      return toast.error("Project title required");
    }

    const newProject = await createProject(
      titleInput.current.value,
      descInput.current.value,
      [userDetails._id, ...ownersId],
      membersId
    );

    if (newProject) {
      setProject([...projects, newProject]);
      navigate(`/project/${newProject._id}`);

      closeBtnRef.current.click();
      toast.dismiss();
      toast.success("Project has been created successfully!");
    }
  }

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

  function addOwner() {
    addUsers(searchOwnerInput, owners, ownersId, setOwners, setOwnersId);
  }

  function addMember() {
    addUsers(searchMemberInput, members, membersId, setMembers, setMembersId);
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
    <ProjectModal
      id="createProjectPrompt"
      title="Create Project"
      inputId={{
        title: "new-project-title",
        desc: "new-project-desc",
        owners: "new-project-owners",
        members: "new-project-members",
      }}
      inputRef={{
        titleInput,
        descInput,
        searchMemberInput,
        searchOwnerInput,
        closeBtnRef,
      }}
      owner={owner}
      ownerList={ownerList}
      memberList={memberList}
      handleCreate={handleCreate}
      submitFunctions={{ addOwner, addMember }}
      submitBtnLabel="Create Project"
    />
  );
};

export default CreateProject;

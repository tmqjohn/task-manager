import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useUserStore,
  useProjectStore,
  useChatStore,
} from "../../../store/store";

import { getUserDetails } from "../../api/user";
import { updateProject, deleteProject } from "../../api/projects";

import { projectChanges } from "../../../helpers/socket";

import ProjectModal from "../../layout/ModalLayout/ProjectModal";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";

const ManageProject = ({ projectDefaults, setProjectsDefaults }) => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const socket = useChatStore((state) => state.socket);

  const [owners, setOwners] = useState([]);
  const [ownersId, setOwnersId] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersId, setMembersId] = useState([]);

  const titleInput = useRef();
  const descInput = useRef();
  const searchMemberInput = useRef();
  const searchOwnerInput = useRef();
  const closeBtnRef = useRef();

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
        if (
          searchValue === userDetails.username ||
          searchValue === userDetails.email
        ) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("Owner cannot be added as member");
        }

        if (
          users.includes(foundUser.fullName) ||
          users.includes(foundUser.email)
        ) {
          searchInput.current.value = "";
          searchInput.focus;

          toast.dismiss();
          return toast.error("User is already added in the project");
        }

        if (
          owners.includes(foundUser.fullName) ||
          owners.includes(foundUser.email)
        ) {
          removeUsers(
            foundUser.fullName,
            ownersId,
            owners,
            setOwners,
            setOwnersId
          );
        }

        if (
          members.includes(foundUser.fullName) ||
          members.includes(foundUser.email)
        ) {
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
      setProjects();
      projectChanges(socket);

      closeBtnRef.current.click();
      toast.dismiss();
      toast.success("Project has been updated successfully!");
    }
  }

  async function handleDelete() {
    let taskIds = [];

    selectedProject[0].groupDetails.map((task) =>
      task.tasks.map((taskId) => taskIds.push(taskId))
    );

    const updatedProjects = await deleteProject(
      selectedProject[0]._id,
      selectedProject[0].owner[0],
      selectedProject[0].groups,
      taskIds,
      selectedProject[0].chatHistory
    );

    if (updatedProjects) {
      setProjects();
      projectChanges(socket);
      navigate("/");

      toast.dismiss();
      toast.success("Project has been deleted successfully!");
    }
  }

  return (
    <>
      <ProjectModal
        id="manageProjectPrompt"
        title="Manage Project"
        inputId={{
          title: "edit-project-title",
          desc: "edit-project-desc",
          owners: "edit-project-owners",
          members: "edit-project-members",
        }}
        inputRef={{
          titleInput,
          descInput,
          searchMemberInput,
          searchOwnerInput,
          closeBtnRef,
        }}
        owner={null}
        ownerList={ownerList}
        memberList={memberList}
        handleEdit={handleEdit}
        submitFunctions={{ addOwner, addMember }}
        submitBtnLabel="Update Project"
        projectDefaults={projectDefaults}
        selectedProject={selectedProject}
      />

      <ConfirmModal
        id="confirmDeletePrompt"
        title={`Are you sure you want to delete '${selectedProject[0]?.title}' project?`}
        body="This will also delete all the groups and tasks in the project. This action cannot be undone."
        submitFunction={async () => await handleDelete()}
        optionalClose={true}
        optionalCloseTarget="#manageProjectPrompt"
        optionalFunction={() => setProjectsDefaults((prev) => !prev)}
      />
    </>
  );
};

export default ManageProject;

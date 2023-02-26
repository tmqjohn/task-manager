import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useProjectStore,
  useGroupStore,
  useUserStore,
} from "../../../store/store";

import { addNewGroup, updateGroup, deleteGroup } from "../../api/group";

import Task from "./Task";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";
import GroupsModal from "../../layout/ModalLayout/GroupsModal";

import "./styles/project.css";

const Group = () => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));
  const { groups, setGroups } = useGroupStore((state) => ({
    groups: state.groups,
    setGroups: state.setGroups,
  }));

  const [groupId, setGroupId] = useState();
  const [groupName, setGroupName] = useState();

  const { projectId } = useParams();

  const groupTitleNewInput = useRef();
  const groupTitleEditInput = useRef();
  const closeEditBtn = useRef();
  const closeNewBtn = useRef();

  useEffect(() => {
    setGroups(selectedProject[0]?.groupDetails);
  }, [selectedProject]);

  function handleShowGroupAdd() {
    groupTitleNewInput.current.value = "";
  }

  async function handleAddGroup() {
    const isSuccess = await addNewGroup(
      projectId,
      groupTitleNewInput.current.value
    );

    if (isSuccess) {
      setProjects();

      closeNewBtn.current.click();
    }
  }

  function handleShowGroupEdit(title, id) {
    groupTitleEditInput.current.value = title;

    setGroupId(id);
  }

  async function handleSubmitEditGroup() {
    const isSuccess = await updateGroup(
      groupTitleEditInput.current.value,
      groupId
    );

    if (isSuccess) {
      setProjects();

      closeEditBtn.current.click();
    }
  }

  function handleShowRemoveGroup(title, id) {
    setGroupId(id);
    setGroupName(title);
  }

  async function handleRemoveGroup() {
    const isSuccess = await deleteGroup(groupId, projectId);

    if (isSuccess) {
      setProjects();

      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  return (
    <>
      <section className="project-content d-flex flex-column flex-fill py-2">
        {selectedProject[0]?.owner.includes(userDetails?._id) ? (
          <>
            <section className="control-buttons d-flex">
              <button
                className="btn btn-primary border border-0 p-1 ms-1 mb-2"
                data-bs-target="#addGroupPrompt"
                data-bs-toggle="modal"
                onClick={handleShowGroupAdd}
              >
                <img src="/group_add.svg" /> Add Group
              </button>
            </section>
          </>
        ) : null}

        <section className="project-group-list flex-fill">
          {groups?.map((group) => (
            <div className="project-group mt-2" key={group._id}>
              <div className="group-title target-hover d-flex pb-2">
                <h4>{group.title}</h4>

                {selectedProject[0]?.owner.includes(userDetails?._id) ? (
                  <>
                    <button
                      className="show-controls btn p-0 border border-0 ms-2 me-1"
                      data-bs-target="#editGroupTitlePrompt"
                      data-bs-toggle="modal"
                      onClick={() =>
                        handleShowGroupEdit(group.title, group._id)
                      }
                    >
                      <img src="/edit_big.svg" />
                    </button>
                    <button
                      className="show-controls btn p-0 border border-0"
                      data-bs-target="#confirmDeleteGroupPrompt"
                      data-bs-toggle="modal"
                      onClick={() =>
                        handleShowRemoveGroup(group.title, group._id)
                      }
                    >
                      <img src="/remove_big.svg" />
                    </button>

                    <button
                      className="show-controls btn btn-primary border border-0 ps-1 pe-2 py-0 ms-4"
                      data-bs-target="#confirmDeleteGroupPrompt"
                      data-bs-toggle="modal"
                    >
                      <img src="/add_small.svg" /> Add Task
                    </button>
                  </>
                ) : null}
              </div>

              <Task group={group} />
            </div>
          ))}
        </section>
      </section>

      <GroupsModal
        id="addGroupPrompt"
        title="Add New Group"
        inputId="group-new-title"
        inputTitleRef={groupTitleNewInput}
        closeBtnRef={closeNewBtn}
        submitFunction={async () => await handleAddGroup()}
        submitBtnLabel="Add"
      />

      <GroupsModal
        id="editGroupTitlePrompt"
        title="Edit Group Title"
        inputId="group-edit-title"
        inputTitleRef={groupTitleEditInput}
        closeBtnRef={closeEditBtn}
        submitFunction={async () => await handleSubmitEditGroup()}
        submitBtnLabel="Update"
      />

      <ConfirmModal
        id="confirmDeleteGroupPrompt"
        title={`Are you sure you want to delete '${groupName}' group?`}
        body="This action cannot be undone."
        submitFunction={async () => await handleRemoveGroup()}
      />
    </>
  );
};

export default Group;

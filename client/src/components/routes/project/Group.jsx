import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useProjectStore,
  useGroupStore,
  useUserStore,
} from "../../../store/store";

import { addNewGroup, updateGroup, deleteGroup } from "../../api/group";
import { addNewTask, updateTask, deleteTask } from "../../api/task";

import Task from "./Task";
import Chat from "./Chat";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";
import GroupsModal from "../../layout/ModalLayout/GroupsModal";
import TasksModal from "../../layout/ModalLayout/TasksModal";

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
  const [taskId, setTaskId] = useState();
  const [groupTitle, setGroupTitle] = useState();
  const [taskTitle, setTaskTitle] = useState();
  const [taskInputDefaults, setTaskInputDefaults] = useState(false);

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

  function handleShowRemoveGroup(groupTitle, groupId, taskId) {
    setGroupId(groupId);
    setTaskId(taskId);
    setGroupTitle(groupTitle);
  }

  async function handleRemoveGroup() {
    const isSuccess = await deleteGroup(groupId, projectId, taskId);

    if (isSuccess) {
      setProjects();

      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  function handleShowTaskModal(groupId, taskId, status = false) {
    setGroupId(groupId);
    setTaskId(taskId);

    if (!status) {
      setTaskInputDefaults((prev) => !prev);
    }
  }

  async function handleAddTask(taskTitle, dueDate, noteInput, closeBtnRef) {
    const isSuccess = await addNewTask(taskTitle, dueDate, noteInput, groupId);

    if (isSuccess) {
      setProjects();

      closeBtnRef.current.click();
    }
  }

  async function handleEditTask(taskTitle, dueDate, noteInput, closeBtnRef) {
    const isSuccess = await updateTask(
      taskTitle,
      taskId,
      dueDate,
      noteInput,
      (status = false)
    );

    if (isSuccess) {
      setProjects();

      closeBtnRef.current.click();
    }
  }

  function handleShowRemoveTask(groupId, taskId, title) {
    setGroupId(groupId);
    setTaskId(taskId);
    setTaskTitle(title);
  }

  async function handleRemoveTask() {
    const isSuccess = await deleteTask(groupId, taskId);

    if (isSuccess) {
      setProjects();

      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  return (
    <>
      <section className="project-content d-flex flex-column flex-fill py-2">
        <div className="control-buttons mb-2 d-flex">
          {selectedProject[0]?.owner.includes(userDetails?._id) ? (
            <>
              <button
                className="btn btn-primary border border-0 p-1 me-3"
                data-bs-target="#addGroupPrompt"
                data-bs-toggle="modal"
                onClick={handleShowGroupAdd}
              >
                <img src="/group_add.svg" /> Add Group
              </button>
            </>
          ) : null}

          <button
            className="btn btn-primary border border-0 p-1 me-3"
            data-bs-toggle="offcanvas"
            data-bs-target="#chatSystem"
          >
            <img src="/chat_big.svg" /> Chat
          </button>
          <Chat />
        </div>

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
                        handleShowRemoveGroup(
                          group.title,
                          group._id,
                          group.tasks
                        )
                      }
                    >
                      <img src="/remove_big.svg" />
                    </button>

                    <button
                      className="show-controls btn btn-primary border border-0 ps-1 pe-2 py-0 ms-4"
                      data-bs-target="#showAddTaskPrompt"
                      data-bs-toggle="modal"
                      onClick={() => handleShowTaskModal(group._id)}
                    >
                      <img src="/add_small.svg" /> Add Task
                    </button>
                  </>
                ) : null}
              </div>

              <Task
                group={group}
                handleShowTaskModal={handleShowTaskModal}
                handleShowRemoveTask={handleShowRemoveTask}
              />
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
        title={`Are you sure you want to delete '${groupTitle}' group?`}
        body="This action cannot be undone."
        submitFunction={async () => await handleRemoveGroup()}
      />

      <TasksModal
        id="showAddTaskPrompt"
        title="Add Task"
        inputId={{
          taskTitle: "new-task-title",
          dueDate: "new-due-date",
          note: "new-note",
        }}
        handleAddTask={handleAddTask}
        submitBtnLabel="Add"
        taskInputDefaults={taskInputDefaults}
        newTask={true}
      />

      <TasksModal
        id="showEditTaskPrompt"
        title="Edit Task"
        inputId={{
          taskTitle: "edit-task-title",
          dueDate: "edit-due-date",
          note: "edit-note",
        }}
        handleEditTask={handleEditTask}
        submitBtnLabel="Update"
        groupId={groupId}
        taskId={taskId}
        taskInputDefaults={taskInputDefaults}
        newTask={false}
      />

      <ConfirmModal
        id="showRemoveTaskPrompt"
        title={`Are you sure you want to delete '${taskTitle}' task?`}
        body="This action cannot be undone."
        submitFunction={async () => await handleRemoveTask()}
      />
    </>
  );
};

export default Group;

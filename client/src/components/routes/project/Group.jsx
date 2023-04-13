import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useProjectStore,
  useGroupStore,
  useUserStore,
  useChatStore,
} from "../../../store/store";

import { addNewGroup, updateGroup, deleteGroup } from "../../api/group";
import { addNewTask, updateTask, deleteTask } from "../../api/task";
import { getUserProjects, updateMemberList } from "../../api/projects";

import { projectChanges, updateProject } from "../../../helpers/socket";

import Task from "./Task";
import Chat from "./Chat";
import ConfirmModal from "../../layout/ModalLayout/ConfirmModal";
import GroupsModal from "../../layout/ModalLayout/GroupsModal";
import TasksModal from "../../layout/ModalLayout/TasksModal";
import { getUserDetails } from "../../api/user";

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
  const socket = useChatStore((state) => state.socket);

  const [groupId, setGroupId] = useState();
  const [taskId, setTaskId] = useState();
  const [assigneeList, setAssigneeList] = useState([]);
  const [assigneeIdList, setAssigneeIdList] = useState([]);
  const [groupTitle, setGroupTitle] = useState();
  const [taskTitle, setTaskTitle] = useState();
  const [taskInputDefaults, setTaskInputDefaults] = useState(false);

  const { projectId } = useParams();

  const groupTitleNewInput = useRef();
  const groupTitleEditInput = useRef();
  const closeNewBtn = useRef();
  const closeEditBtn = useRef();
  const chatBtnRef = useRef();

  useEffect(() => {
    setGroups(selectedProject[0]?.groupDetails);
  }, [selectedProject]);

  useEffect(() => {
    updateProject(socket, () => {
      setProjects();
    });
  }, [socket]);

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
      projectChanges(socket);

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
      projectChanges(socket);

      closeEditBtn.current.click();
    }
  }

  function handleShowRemoveGroup(groupTitle, groupId, taskId) {
    setGroupId(groupId);
    setTaskId(taskId);
    setGroupTitle(groupTitle);
  }

  async function handleRemoveGroup() {
    const newMembers = [
      ...new Set(
        selectedProject[0].groupDetails
          .filter((group) => group._id != groupId)
          .map((group) => group.taskDetails.flatMap((task) => task.assignee))
          .flatMap((assigneeId) => assigneeId)
      ),
    ];

    const isSuccess = await deleteGroup(groupId, projectId, taskId, newMembers);

    if (isSuccess) {
      setProjects();
      projectChanges(socket);
      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  // ******** TASKS FUNCTIONS - coded here due to fetching mapped group ID  ******** //
  function handleShowTaskModal(groupId, taskId, status = false) {
    setGroupId(groupId);
    setTaskId(taskId);

    if (!status) {
      setTaskInputDefaults((prev) => !prev);
    }
  }

  async function handleAddTask(taskTitle, dueDate, noteInput, closeBtnRef) {
    if (!taskTitle) {
      toast.dismiss();
      return toast.error("Task title required");
    }

    const projectId = selectedProject[0]._id;
    const members = [
      ...new Set([...assigneeIdList, ...selectedProject[0].members]),
    ];

    const isSuccess = await addNewTask(
      taskTitle,
      dueDate,
      noteInput,
      assigneeIdList,
      members,
      groupId,
      projectId
    );

    if (isSuccess) {
      setProjects();
      projectChanges(socket);

      closeBtnRef.current.click();
    }
  }

  async function handleEditTask(taskTitle, dueDate, noteInput, closeBtnRef) {
    await updateTask(
      taskTitle,
      taskId,
      dueDate,
      noteInput,
      assigneeIdList,
      (status = false)
    );

    const updatedProject = await getUserProjects(userDetails._id);

    const newMembers = [
      ...new Set(
        updatedProject
          .filter((project) => project._id === projectId)[0]
          .groupDetails.map((group) =>
            group.taskDetails.flatMap((task) => task.assignee)
          )
          .flatMap((id) => id)
      ),
    ];

    const isSuccess = await updateMemberList(projectId, newMembers);

    if (isSuccess) {
      setProjects();
      projectChanges(socket);

      closeBtnRef.current.click();
    }
  }

  function handleShowRemoveTask(groupId, taskId, title) {
    setGroupId(groupId);
    setTaskId(taskId);
    setTaskTitle(title);
  }

  async function handleRemoveTask() {
    await deleteTask(groupId, taskId);
    const updatedProject = await getUserProjects(userDetails._id);

    const newMembers = [
      ...new Set(
        updatedProject
          .filter((project) => project._id === projectId)[0]
          .groupDetails.map((group) =>
            group.taskDetails.flatMap((task) => task.assignee)
          )
          .flatMap((id) => id)
      ),
    ];

    const isSuccess = await updateMemberList(projectId, newMembers);

    if (isSuccess) {
      setProjects();
      projectChanges(socket);
      toast.dismiss();
      toast.success(isSuccess.message);
    }
  }

  async function handleAddAssignee(searchInput) {
    let searchValue = searchInput.current.value;

    if (!searchValue) {
      searchInput.focus;

      toast.dismiss();
      return toast.error("Please enter a registered username or email");
    }

    const foundUser = await getUserDetails(searchValue);

    if (foundUser.message) {
      searchInput.focus;

      toast.dismiss();
      return toast.error(foundUser.message);
    }

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
      assigneeList.includes(foundUser.fullName) ||
      assigneeList.includes(foundUser.email)
    ) {
      searchInput.current.value = "";
      searchInput.focus;

      toast.dismiss();
      return toast.error("User is already added in the project");
    }

    searchInput.current.value = "";
    searchInput.focus;

    setAssigneeList([...assigneeList, foundUser.fullName]);
    setAssigneeIdList([...assigneeIdList, foundUser._id]);
  }

  async function handleRemoveAssignee(assignee) {
    const removeAssignee = assignee;
    const removeAssigneeId =
      assigneeIdList[assigneeList.indexOf(removeAssignee)];

    setAssigneeList((prev) =>
      prev.filter((assignee) => assignee != removeAssignee)
    );
    setAssigneeIdList((prev) =>
      prev.filter((assigneeId) => assigneeId != removeAssigneeId)
    );
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
            ref={chatBtnRef}
          >
            <img src="/chat_big.svg" /> Chat
          </button>
          <Chat chatBtnRef={chatBtnRef} />
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
        assigneeList={assigneeList}
        setAssigneeList={setAssigneeList}
        setAssigneeIdList={setAssigneeIdList}
        inputId={{
          taskTitle: "new-task-title",
          dueDate: "new-due-date",
          note: "new-note",
          assignee: "new-assignee",
        }}
        handleAddTask={handleAddTask}
        handleAddAssignee={handleAddAssignee}
        handleRemoveAssignee={handleRemoveAssignee}
        submitBtnLabel="Add"
        taskInputDefaults={taskInputDefaults}
        newTask={true}
      />

      <TasksModal
        id="showEditTaskPrompt"
        title="Edit Task"
        assigneeList={assigneeList}
        setAssigneeList={setAssigneeList}
        setAssigneeIdList={setAssigneeIdList}
        inputId={{
          taskTitle: "edit-task-title",
          dueDate: "edit-due-date",
          note: "edit-note",
          assignee: "edit-assignee",
        }}
        handleEditTask={handleEditTask}
        handleAddAssignee={handleAddAssignee}
        handleRemoveAssignee={handleRemoveAssignee}
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

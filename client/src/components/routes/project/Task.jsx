import React from "react";

import { useUserStore, useProjectStore } from "../../../store/store";

import { updateTask } from "../../api/task";

const Task = ({ group, handleShowTaskModal, handleShowRemoveTask }) => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { selectedProject, setProjects } = useProjectStore((state) => ({
    selectedProject: state.selectedProject,
    setProjects: state.setProjects,
  }));

  const statusText = ["Pending", "Ongoing", "Done"];

  async function updateStatus(statusText, taskId) {
    await updateTask(statusText, taskId);

    setProjects();
  }

  function taskColor(taskStatus) {
    if (taskStatus === "Pending") {
      return "danger";
    }
    if (taskStatus === "Ongoing") {
      return "warning";
    }
    if (taskStatus === "Done") {
      return "success";
    }
  }

  return (
    <>
      <table className="table table-bordered table-sm mb-3">
        <thead>
          <tr>
            <th className="w-25" scope="col">
              Task
            </th>
            <th scope="col">Due Date</th>
            <th className="w-25" scope="col">
              Status
            </th>
            <th className="w-25" scope="col">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {group.taskDetails.map((task) => (
            <tr
              className={`target-hover table-${taskColor(task.status)}`}
              key={task._id}
            >
              <td>
                <div className="task-title-container d-flex">
                  {task.title}

                  <div className="ms-auto d-flex">
                    {selectedProject[0]?.owner.includes(userDetails._id) ? (
                      <>
                        <button
                          className="show-controls btn border border-0 p-0 mx-1"
                          data-bs-target="#showEditTaskPrompt"
                          data-bs-toggle="modal"
                          onClick={() =>
                            handleShowTaskModal(group._id, task._id)
                          }
                        >
                          <img src="/edit_small.svg" />
                        </button>
                        <button
                          className="show-controls btn border border-0 p-0 mx-1"
                          data-bs-target="#showRemoveTaskPrompt"
                          data-bs-toggle="modal"
                          onClick={() =>
                            handleShowRemoveTask(
                              group._id,
                              task._id,
                              task.title
                            )
                          }
                        >
                          <img src="/remove_small.svg" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </td>

              <td>{task.dueDate}</td>

              <td>
                <div className="task-status-container d-flex">
                  {task.status}

                  <button
                    className="show-controls btn border border-0 p-0 mx-1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={() =>
                      handleShowTaskModal(group._id, task._id, (status = true))
                    }
                  >
                    <img src="/more_small.svg" />
                  </button>

                  <ul className="p-0 dropdown-menu">
                    {statusText
                      .filter((status) => status != task.status)
                      .map((taskStatus, i) => (
                        <li key={i}>
                          <button
                            className={`btn btn-${taskColor(
                              taskStatus
                            )} w-100 border border-0 rounded-0`}
                            onClick={() => {
                              updateStatus(taskStatus, task._id);
                            }}
                          >
                            {taskStatus}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              </td>

              <td>{task.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Task;

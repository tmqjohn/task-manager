import React from "react";

const Task = ({ group, handleShowTaskModal, handleShowRemoveTask }) => {
  function taskColor(taskStatus) {
    if (taskStatus === "Pending") {
      return "table-danger";
    }
    if (taskStatus === "Ongoing") {
      return "table-warning";
    }
    if (taskStatus === "Done") {
      return "table-success";
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
            <th scope="col">Status</th>
            <th className="w-25" scope="col">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {group.taskDetails.map((task) => (
            <tr className={taskColor(task.status)} key={task._id}>
              <td className="target-hover d-flex mh-100">
                {task.title}
                <span className="ms-auto d-flex">
                  <button
                    className="show-controls btn border border-0 p-0 mx-1"
                    data-bs-target="#showEditTaskPrompt"
                    data-bs-toggle="modal"
                    onClick={() => handleShowTaskModal(group._id, task._id)}
                  >
                    <img src="/edit_small.svg" />
                  </button>
                  <button
                    className="show-controls btn border border-0 p-0 mx-1"
                    data-bs-target="#showRemoveTaskPrompt"
                    data-bs-toggle="modal"
                    onClick={() =>
                      handleShowRemoveTask(group._id, task._id, task.title)
                    }
                  >
                    <img src="/remove_small.svg" />
                  </button>
                </span>
              </td>
              <td>{task.dueDate}</td>
              <td>{task.status}</td>
              <td>{task.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Task;

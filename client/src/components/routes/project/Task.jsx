import React from "react";

import "./styles/project.css";

const Task = ({ group }) => {
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
    <table className="table table-striped table-bordered table-sm mb-3">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Due Date</th>
          <th scope="col">Status</th>
          <th scope="col">Note</th>
        </tr>
      </thead>
      <tbody>
        {group.taskDetails.map((task) => (
          <tr className={taskColor(task.status)} key={task._id}>
            <td className="target-hover d-flex" scope="row">
              {task.title}
              <button className="show-controls btn border border-0 p-0 ms-auto">
                <img src="/edit_small.svg" />
              </button>
            </td>
            <td>{task.dueDate}</td>
            <td>{task.status}</td>
            <td>{task.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Task;

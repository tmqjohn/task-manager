import React, { useEffect, useRef } from "react";

import { useGroupStore } from "../../../store/store";

const TasksModal = ({
  id,
  title,
  assigneeList,
  setAssigneeList,
  setAssigneeIdList,
  inputId,
  handleAddTask,
  handleEditTask,
  handleAddAssignee,
  handleRemoveAssignee,
  submitBtnLabel,
  groupId,
  taskId,
  taskInputDefaults,
  newTask,
}) => {
  const groups = useGroupStore((state) => state.groups);

  const taskTitleInput = useRef();
  const dueInput = useRef();
  const noteInput = useRef();
  const assigneeInput = useRef();

  const closeBtnRef = useRef();

  useEffect(() => {
    if (newTask) {
      taskTitleInput.current.value = "";
      dueInput.current.valueAsNumber = Date.now();
      noteInput.current.value = "";
      assigneeInput.current.value = "";
      setAssigneeList([]);
      setAssigneeIdList([]);
    } else {
      let getTaskDetails = groups
        ?.filter((group) => groupId === group._id)[0]
        ?.taskDetails.filter((task) => task._id === taskId)[0];

      taskTitleInput.current.value = getTaskDetails?.title;
      dueInput.current.value = getTaskDetails?.dueDate;
      noteInput.current.value = getTaskDetails?.note;
      assigneeInput.current.value = "";
      setAssigneeList(
        getTaskDetails?.assigneeName ? getTaskDetails.assigneeName : []
      );
      setAssigneeIdList(
        getTaskDetails?.assignee ? getTaskDetails.assignee : []
      );
    }
  }, [taskInputDefaults]);

  const assignees = assigneeList?.map((assignee, i) => (
    <li className="list-group-item" key={i}>
      <button
        className="btn p-0"
        onClick={(e) => handleRemoveAssignee(e.target.offsetParent.innerText)}
      >
        <img src="/remove.svg" />
      </button>
      {assignee}
    </li>
  ));

  return (
    <div
      className="modal fade"
      id={id}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">{title}</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="modal-body">
              <section className="mb-3">
                <label htmlFor={inputId.taskTitle} className="col-form-label">
                  Task Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={inputId.taskTitle}
                  ref={taskTitleInput}
                />
              </section>

              <section className="mb-3">
                <label htmlFor={inputId.dueDate} className="col-form-label">
                  Due Date:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id={inputId.dueDate}
                  ref={dueInput}
                />
              </section>

              <section className="mb-3">
                <label htmlFor={inputId.note} className="col-form-label">
                  Note:
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id={inputId.note}
                  ref={noteInput}
                />
              </section>

              <section>
                <label htmlFor={inputId.assignee} className="col-form-label">
                  Assignee/s:
                </label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control me-3"
                    id={inputId.assignee}
                    placeholder="Search by username or email"
                    ref={assigneeInput}
                  />
                  <button
                    className="btn ms-auto p-0"
                    onClick={async () => await handleAddAssignee(assigneeInput)}
                  >
                    <img src="/add_big.svg" />
                  </button>
                </div>

                <ul className="list-group list-group-flush mt-1 mb-0">
                  {assignees}
                </ul>
              </section>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeBtnRef}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  newTask
                    ? () =>
                        handleAddTask(
                          taskTitleInput.current.value,
                          dueInput.current.value,
                          noteInput.current.value,
                          closeBtnRef
                        )
                    : () =>
                        handleEditTask(
                          taskTitleInput.current.value,
                          dueInput.current.value,
                          noteInput.current.value,
                          closeBtnRef
                        )
                }
              >
                {submitBtnLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TasksModal;

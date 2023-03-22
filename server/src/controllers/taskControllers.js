const asyncHandler = require("express-async-handler");
const Task = require("../schema/TaskSchema");
const User = require("../schema/UserSchema");

/**@ GET request
 * gets all tasks
 * /api/task
 */
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().lean();

  const tasksDetails = await Promise.all(
    tasks.map(async (task) => {
      const assigneeList = await Promise.all(
        task.assignee.map(
          async (assignee) =>
            await User.findById(assignee).select("fullName").exec()
        )
      );

      const assigneeName = assigneeList.map((assignee) => assignee.fullName);

      return {
        ...task,
        assigneeName,
      };
    })
  );

  return res.status(200).json(tasksDetails);
});

/**@ POST request
 * add new task
 * /api/task
 */
const addNewTask = asyncHandler(async (req, res) => {
  const { title, dueDate, note, assignee } = req.body;

  const newTask = await Task.create({
    title,
    dueDate,
    note,
    assignee,
  });

  if (newTask) {
    res.status(200).json(newTask);
  } else {
    res.status(500).json({ message: "There was an error creating a new task" });
  }
});

/**@ PATCH request
 * updates a task
 * /api/task/:taskId
 */
const updateTask = asyncHandler(async (req, res) => {
  const { title, dueDate, status, note, assignee } = req.body;
  const { taskId } = req.params;

  const foundTask = await Task.findById(taskId).exec();

  if (status) {
    foundTask.status = status;
  } else {
    foundTask.title = title;
    foundTask.dueDate = dueDate;
    foundTask.note = note;
    foundTask.assignee = assignee;
  }

  const result = await foundTask.save();

  const assigneeList = await Promise.all(
    result.assignee.map(
      async (assignee) =>
        await User.findById(assignee).select("fullName").exec()
    )
  );

  const assigneeName = assigneeList.map((assignee) => assignee.fullName);

  if (result === foundTask) {
    res.status(200).json({ ...result.toObject(), assigneeName });
  } else {
    res.status(500).json({ message: "There was an error updating task" });
  }
});

/**@ DELETE request
 * deletes a task
 * /api/task/:taskId
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const result = await Task.findByIdAndDelete(taskId).exec();

  if (result) {
    res.status(200).json({ message: "Task has been deleted successfully" });
  } else {
    res.status(500).json({ message: "There was an error deleting task" });
  }
});

/**@ PUT request
 * deletes tasks from a deleted group and project
 * /api/task/group
 */
const deleteAllTask = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;

  const result = await Task.deleteMany({ _id: taskIds });

  if (result.acknowledged) {
    res.status(200).json({
      message:
        "Tasks associated with the deleted group has been deleted successfully",
    });
  } else {
    res.status(400).json({ message: "There was an error deleting the groups" });
  }
});

module.exports = {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
  deleteAllTask,
};

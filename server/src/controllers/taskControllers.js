const asyncHandler = require("express-async-handler");
const Task = require("../schema/TaskSchema");

/**@ GET request
 * gets all tasks
 * /api/task
 */
const getAllTasks = asyncHandler(async (req, res) => {
  const foundTasks = await Task.find().lean();

  if (foundTasks) {
    res.status(200).json(foundTasks);
  } else {
    res.status(500).json({ message: "No Tasks Found" });
  }
});

/**@ POST request
 * add new task
 * /api/task
 */
const addNewTask = asyncHandler(async (req, res) => {
  const { title, dueDate, note } = req.body;

  const newTask = new Task({
    title,
    dueDate,
    note,
  });

  const result = await newTask.save();

  if (result) {
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
  const { title, dueDate, note } = req.body;
  const { taskId } = req.params;

  const foundTask = await Task.findById(taskId).exec();

  foundTask.title = title;
  foundTask.dueDate = dueDate;
  foundTask.note = note;

  const result = await foundTask.save();

  if (result === foundTask) {
    res.status(200).json(foundTask);
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

  console.log(result);

  if (result) {
    res.status(200).json({ message: "Task has been deleted successfully" });
  } else {
    res.status(500).json({ message: "There was an error deleting task" });
  }
});

/**@ PUT request
 * deletes tasks from a deleted group
 * /api/task/group
 */
const deleteAllTask = asyncHandler(async (req, res) => {
  const { taskIds } = req.body;

  const result = await Group.deleteMany({ _id: taskIds });

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

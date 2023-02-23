const asyncHandler = require("express-async-handler");
const Task = require("../schema/TaskSchema");

/**@ GET request
 * gets all tasks
 * /api/task
 */
const getAllTasks = asyncHandler(async (req, res) => {
  res.send("@GET task");
});

/**@ POST request
 * add new task
 * /api/task
 */
const addNewTask = asyncHandler(async (req, res) => {
  res.send("@POST task");
});

/**@ PUT request
 * updates a task
 * /api/task
 */
const updateTask = asyncHandler(async (req, res) => {
  res.send("@PUT task");
});

/**@ DELETE request
 * deletes a task
 * /api/task
 */
const deleteTask = asyncHandler(async (req, res) => {
  res.send("@DELETE task");
});

module.exports = {
  getAllTasks,
  addNewTask,
  updateTask,
  deleteTask,
};

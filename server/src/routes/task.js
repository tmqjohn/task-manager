const { Router } = require("express");

const taskControllers = require("../controllers/taskControllers");

const router = Router();

/** /api/task route */

router
  .route("/")
  .get(taskControllers.getAllTasks)
  .post(taskControllers.addNewTask)
  .put(taskControllers.updateTask)
  .delete(taskControllers.deleteTask);

module.exports = router;

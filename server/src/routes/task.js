const { Router } = require("express");

const taskControllers = require("../controllers/taskControllers");

const router = Router();

/** /api/task route */

router
  .route("/")
  .get(taskControllers.getAllTasks) //gets all tasks
  .post(taskControllers.addNewTask); // add a new task

router.route("/group").put(taskControllers.deleteAllTask); // delete all task linked from a deleted group

router
  .route("/:taskId")
  .patch(taskControllers.updateTask) // updates task
  .delete(taskControllers.deleteTask); // deletes a task

module.exports = router;

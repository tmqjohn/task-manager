const { Router } = require("express");

const groupController = require("../controllers/groupControllers");

const router = Router();

/** /api/group route */

router
  .route("/")
  .get(groupController.getAllGroups) //gets all groups
  .post(groupController.addNewGroup); // add a new group

router.route("/project").put(groupController.deleteAllGroup); // deletes all groups linked from a project

router.route("/tasks/add").patch(groupController.addGroupTask); // add tasks to a group

router
  .route("/:groupId")
  .put(groupController.updateGroup) // update group
  .delete(groupController.deleteGroup); // delete a group

router.route("/tasks/delete/:groupId").patch(groupController.deleteGroupTask); // delete a task from a group

module.exports = router;

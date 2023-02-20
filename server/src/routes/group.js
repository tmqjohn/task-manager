const { Router } = require("express");

const groupController = require("../controllers/groupControllers");

const router = Router();

/** /api/group route */

router
  .route("/")
  .get(groupController.getAllGroups) //gets all groups
  .post(groupController.addNewGroup); // add a new group

router
  .route("/:groupId")
  .put(groupController.updateGroup) // update group
  .delete(groupController.deleteGroup); // delete a group

module.exports = router;

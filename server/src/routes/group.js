const { Router } = require("express");

const groupController = require("../controllers/groupControllers");

const router = Router();

router
  .route("/")
  .get(groupController.getAllGroups)
  .post(groupController.addNewGroup)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;

const { Router } = require("express");

const projectController = require("../controllers/projectControllers");

const router = Router();

/** /api/projects route */

router
  .route("/")
  .get(projectController.getAllProjects) // gets all projects
  .post(projectController.addProject); // create new project

router
  .route("/:projectId")
  .delete(projectController.deleteProject) // deletes a project
  .patch(projectController.updateProject); // updates and edit project;

router.patch("/:projectId/members/update/", projectController.updateMembers); // updates the members list only

router.patch("/:projectId/file/add", projectController.addPendingFile); //add a pending approval for file ownership to owner

router.get("/user/:id", projectController.getUserProjects); //gets all the projects for a specific user

router.patch("/groups/add", projectController.addProjectGroup); // add group in a project

router
  .route("/groups/delete/:projectId")
  .patch(projectController.deleteProjectGroup); // delete a groupid from a project

module.exports = router;

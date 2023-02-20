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

router.route("/user/:id").get(projectController.getUserProjects); //gets all the projects for a specific user

router.route("/groups/:projectId").patch(projectController.updateProjectGroups); // updates only the groups in the projects

module.exports = router;

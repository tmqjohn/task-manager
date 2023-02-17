const { Router } = require("express");

const projectController = require("../controllers/projectControllers");

const router = Router();

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.addProject)
  .patch(projectController.updateProject);

router.get("/user/:id", projectController.getUserProjects);

router.delete("/:projectId", projectController.deleteProject);

module.exports = router;

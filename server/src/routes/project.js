const { Router } = require("express");

const projectController = require("../controllers/projectControllers");

const router = Router();

router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.addProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

router.get("/user/:id", projectController.getUserProjects);

module.exports = router;

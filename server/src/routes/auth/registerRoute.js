const { Router } = require("express");
const registerController = require("../../controllers/registerControllers");

const router = Router();

// /register route requests
router
  .route("/")
  .post(registerController.addNewUser)
  .put(registerController.updateUser);

module.exports = router;

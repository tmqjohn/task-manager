const { Router } = require("express");
const loginControllers = require("../../controllers/loginControllers");

const router = Router();

router
  .route("/")
  .get(loginControllers.getUser)
  .post(loginControllers.loginUser);

module.exports = router;

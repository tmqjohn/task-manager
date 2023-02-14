const { Router } = require("express");
const userControllers = require("../controllers/userControllers");

const router = Router();

/** /api/auth/user route */
router
  .route("/")
  .get(userControllers.getAllUsers) // get all user details
  .put(userControllers.updateUser); // update user details

router.route("/:username").get(userControllers.getUser); // get one user details

router.route("/login").post(userControllers.loginUser); // login request for token
router.route("/register").post(userControllers.registerNewUser); // register new user

module.exports = router;

const { Router } = require("express");
const userControllers = require("../controllers/userControllers");
const resetSession = require("../middlewares/createResetSession");

const router = Router();

// /api/auth/user route

router.route("/").get(userControllers.getAllUsers); // get all user details

router
  .route("/:username")
  .get(userControllers.getUser) // get one user details
  .put(userControllers.updateUser); // update user details

router.route("/login").post(userControllers.loginUser); // login request for token
router.route("/loginGoogle").post(userControllers.googleLoginUser); // login request via google

router.route("/register").post(userControllers.registerNewUser); // register new user
router.route("/registerGoogle").post(userControllers.registerNewGoogleUser); // register new user via google credentials

router.route("/recovery/generateOTP").post(userControllers.generateOtp); // generate OTP for password reset
router.route("/recovery/verifyOTP").post(userControllers.verifyOtp); // verify OTP for password reset

router
  .route("/resetPassword/:username")
  .put(resetSession, userControllers.resetPassword);

module.exports = router;

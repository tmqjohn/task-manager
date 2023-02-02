const { Router } = require("express");

const registerRoute = require("./auth/registerRoute");
const loginRoute = require("./auth/loginRoute");

const router = Router();

// server routes
router.use("/auth/register", registerRoute);
router.use("/auth/login", loginRoute);

module.exports = router;

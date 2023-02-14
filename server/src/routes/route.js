const { Router } = require("express");

const userRoute = require("./user");
const projectRoute = require("./project");

const router = Router();

/*****server routes******/
router.use("/api/auth/user", userRoute); // user api route for login, register, etc.
router.use("/api/project", projectRoute); // projects api route

module.exports = router;

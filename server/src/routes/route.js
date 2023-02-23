const { Router } = require("express");

const userRoute = require("./user");
const projectRoute = require("./project");
const groupRoute = require("./group");
const taskRoute = require("./task");

const router = Router();

/*****server routes******/
router.use("/api/auth/user", userRoute); // user api route for login, register, etc.
router.use("/api/project", projectRoute); // projects api route
router.use("/api/group", groupRoute); // groups api route
router.use("/api/task", taskRoute); //tasks api route

module.exports = router;

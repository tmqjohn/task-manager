const { Router } = require("express");

const userRoute = require("./user");
const projectRoute = require("./project");
const groupRoute = require("./group");
const taskRoute = require("./task");
const chatRoute = require("./chat");

const router = Router();

/*****server routes******/
router.use("/api/auth/user", userRoute); // user api route for login, register, etc.
router.use("/api/project", projectRoute); // projects api route
router.use("/api/group", groupRoute); // groups api route
router.use("/api/task", taskRoute); //tasks api route
router.use("/api/chat", chatRoute); //chats api route

module.exports = router;

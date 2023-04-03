const asynchHandler = require("express-async-handler");

const Project = require("../schema/ProjectSchema");
const User = require("../schema/UserSchema");
const Chat = require("../schema/ChatSchema");

const projectDetails = require("../helpers/projectDetails");

/**@ GET request
 * gets all the projects
 * /api/project
 */
const getAllProjects = asynchHandler(async (req, res) => {
  const projects = await Project.find().lean();

  if (!projects)
    return res.status(404).json({ message: "There are no projects found" });

  const allProjects = await projectDetails(projects);

  return res.status(200).json(allProjects);
});

/**@ GET request
 * gets all the specific user's projects
 * /api/project/user/:id
 */
const getUserProjects = asynchHandler(async (req, res) => {
  const { id } = req.params;

  const projects = await Project.find({
    $or: [{ owner: id }, { members: id }],
  }).lean();

  const userProjects = await projectDetails(projects);

  return res.status(200).json(userProjects);
});

/**@ POST request
 * create new project
 * /api/project
 */
const addProject = asynchHandler(async (req, res) => {
  const { title, desc, owner, chatId, googleFolderId } = req.body;

  const newProject = await Project.create({
    title,
    desc,
    owner,
    chatHistory: chatId,
    googleFolderId,
  });

  const ownerList = await Promise.all(
    newProject.owner.map(
      async (owner) => await User.findById(owner).select("fullName").exec()
    )
  );

  const groupDetails = [];

  const chatHistoryDetails = await Chat.findById(newProject.chatHistory).exec();

  const ownerName = ownerList.map((owner) => owner.fullName);
  const membersName = [];

  res.status(200).json({
    ...newProject.toObject(),
    ownerName,
    membersName,
    groupDetails,
    chatHistoryDetails,
  });
});

/**@ PATCH request
 * edit project
 * /api/projects/:projectId/
 */
const updateProject = asynchHandler(async (req, res) => {
  const { title, desc, owner } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);

  if (title) {
    foundProject.title = title;
    foundProject.desc = desc;
  }

  if (owner) {
    foundProject.owner = owner;
  }

  const result = await foundProject.save();

  const updatedProject = await projectDetails([foundProject]);

  if (result === foundProject) {
    res.status(200).json(updatedProject);
  } else {
    res
      .status(400)
      .json({ message: "There was an error updating the project" });
  }
});

/**@ PATCH request
 * update members list
 * /api/projects/:projectId/members/update
 */
const updateMembers = asynchHandler(async (req, res) => {
  const { members } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId).select("members");

  foundProject.members = members;

  foundProject.save();

  res.status(200).json({ message: "Successfully updated members list" });
});

/**@ PATCH request
 * add pending google drive files to be approved by the owner
 * /api/projects/:projectId/file/add
 */
const addPendingFile = asynchHandler(async (req, res) => {
  const { pendingFile } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);

  if (pendingFile) {
    foundProject.pendingFile = [...foundProject.pendingFile, pendingFile];
  } else {
    foundProject.pendingFile = [];
  }

  await foundProject.save();

  res.status(200).json({ message: "Added file details successfully" });
});

/**@ DELETE request
 * deletes a project
 * /api/projects/:projectId
 */
const deleteProject = asynchHandler(async (req, res) => {
  const { projectId } = req.params;

  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (deletedProject) {
    res.status(200).json({ message: "Project has been deleted" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error deleting the project" });
  }
});

/**@ PATCH request
 * add new project groups
 * /api/project/groups/add
 */
const addProjectGroup = asynchHandler(async (req, res) => {
  const { projectId, groups } = req.body;

  const foundProject = await Project.findById(projectId)
    .select("groups")
    .exec();

  foundProject.groups = [...foundProject.groups, groups];

  const result = await foundProject.save();

  if (result === foundProject) {
    res.status(200).json({ message: "Group has been added successfully" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error updating the project" });
  }
});

/**@ PATCH request
 * delete project group
 * /api/project/groups/delete/:projectId
 */
const deleteProjectGroup = asynchHandler(async (req, res) => {
  const { groupId } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId)
    .select("groups")
    .exec();

  foundProject.groups = foundProject.groups.filter((group) => group != groupId);

  const result = await foundProject.save();

  if (result === foundProject) {
    res.status(200).json({ message: "Group removed successfully" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error deleting the project" });
  }
});

module.exports = {
  getAllProjects,
  getUserProjects,
  addProject,
  updateProject,
  updateMembers,
  addPendingFile,
  deleteProject,
  addProjectGroup,
  deleteProjectGroup,
};

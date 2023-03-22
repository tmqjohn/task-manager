const asynchHandler = require("express-async-handler");

const Project = require("../schema/ProjectSchema");
const User = require("../schema/UserSchema");
const Group = require("../schema/GroupSchema");
const Task = require("../schema/TaskSchema");
const Chat = require("../schema/ChatSchema");

/**@ GET request
 * gets all the projects
 * /api/project
 */
const getAllProjects = asynchHandler(async (req, res) => {
  const projects = await Project.find().lean();

  if (!projects)
    return res.status(404).json({ message: "There are no projects found" });

  const projectDetails = await Promise.all(
    projects.map(async (project) => {
      const ownerList = await Promise.all(
        project.owner.map(
          async (owner) => await User.findById(owner).select("fullName").exec()
        )
      );

      const membersList = await Promise.all(
        project.members.map(
          async (member) =>
            await User.findById(member).select("fullName").exec()
        )
      );

      const groups = await Promise.all(
        project.groups.map(
          async (group) => await Group.findById(group).lean().exec()
        )
      );

      const groupDetails = await Promise.all(
        groups.map(async (group) => {
          const tasks = await Promise.all(
            group.tasks.map(
              async (task) => await Task.findById(task).lean().exec()
            )
          );

          const taskDetails = await Promise.all(
            tasks.map(async (task) => {
              const assigneeList = await Promise.all(
                task.assignee.map(
                  async (assignee) =>
                    await User.findById(assignee).select("fullName").exec()
                )
              );

              const assigneeName = assigneeList.map(
                (assignee) => assignee.fullName
              );

              return {
                ...task,
                assigneeName,
              };
            })
          );

          return { ...group, taskDetails };
        })
      );

      const chatHistoryDetails = await Chat.findById(
        project.chatHistory
      ).exec();

      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = membersList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
        groupDetails,
        chatHistoryDetails,
      };
    })
  );

  return res.status(200).json(projectDetails);
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

  const projectDetails = await Promise.all(
    projects.map(async (project) => {
      const ownerList = await Promise.all(
        project.owner.map(
          async (owner) => await User.findById(owner).select("fullName").exec()
        )
      );

      const membersList = await Promise.all(
        project.members.map(
          async (member) =>
            await User.findById(member).select("fullName").exec()
        )
      );

      const groups = await Promise.all(
        project.groups.map(
          async (group) => await Group.findById(group).lean().exec()
        )
      );

      const groupDetails = await Promise.all(
        groups.map(async (group) => {
          const tasks = await Promise.all(
            group.tasks.map(
              async (task) => await Task.findById(task).lean().exec()
            )
          );

          const taskDetails = await Promise.all(
            tasks.map(async (task) => {
              const assigneeList = await Promise.all(
                task.assignee.map(
                  async (assignee) =>
                    await User.findById(assignee).select("fullName").exec()
                )
              );

              const assigneeName = assigneeList.map(
                (assignee) => assignee.fullName
              );

              return {
                ...task,
                assigneeName,
              };
            })
          );

          return { ...group, taskDetails };
        })
      );

      const chatHistoryDetails = await Chat.findById(
        project.chatHistory
      ).exec();

      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = membersList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
        groupDetails,
        chatHistoryDetails,
      };
    })
  );

  return res.status(200).json(projectDetails);
});

/**@ POST request
 * create new project
 * /api/project
 */
const addProject = asynchHandler(async (req, res) => {
  const { title, desc, owner, members, chatId } = req.body;

  const newProject = await Project.create({
    title,
    desc,
    owner,
    members,
    chatHistory: chatId,
  });

  const ownerList = await Promise.all(
    newProject.owner.map(
      async (owner) => await User.findById(owner).select("fullName").exec()
    )
  );

  const membersList = await Promise.all(
    newProject.members.map(
      async (member) => await User.findById(member).select("fullName").exec()
    )
  );

  const groupDetails = [];

  const chatHistoryDetails = await Chat.findById(newProject.chatHistory).exec();

  const ownerName = ownerList.map((owner) => owner.fullName);
  const membersName = membersList.map((member) => member.fullName);

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
 * /api/projects/:projectId
 */
const updateProject = asynchHandler(async (req, res) => {
  const { title, desc, members } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);

  if (!title) {
    foundProject.members = members;
  } else {
    foundProject.title = title;
    foundProject.desc = desc;
  }

  const result = await foundProject.save();

  const ownerList = await Promise.all(
    result.owner.map(
      async (owner) => await User.findById(owner).select("fullName").exec()
    )
  );

  const membersList = await Promise.all(
    result.members.map(
      async (member) => await User.findById(member).select("fullName").exec()
    )
  );

  const groups = await Promise.all(
    result.groups.map(
      async (group) => await Group.findById(group).lean().exec()
    )
  );

  const groupDetails = await Promise.all(
    groups.map(async (group) => {
      const tasks = await Promise.all(
        group.tasks.map(async (task) => await Task.findById(task).lean().exec())
      );

      const taskDetails = await Promise.all(
        tasks.map(async (task) => {
          const assigneeList = await Promise.all(
            task.assignee.map(
              async (assignee) =>
                await User.findById(assignee).select("fullName").exec()
            )
          );

          const assigneeName = assigneeList.map(
            (assignee) => assignee.fullName
          );

          return {
            ...task,
            assigneeName,
          };
        })
      );

      return { ...group, taskDetails };
    })
  );

  const chatHistoryDetails = await Chat.findById(result.chatHistory).exec();

  const ownerName = ownerList.map((owner) => owner.fullName);
  const membersName = membersList.map((member) => member.fullName);

  if (result === foundProject) {
    res.status(200).json({
      ...result.toObject(),
      ownerName,
      membersName,
      groupDetails,
      chatHistoryDetails,
    });
  } else {
    res
      .status(400)
      .json({ message: "There was an error updating the project" });
  }
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
  deleteProject,
  addProjectGroup,
  deleteProjectGroup,
};

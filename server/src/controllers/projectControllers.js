const asynchHandler = require("express-async-handler");

const Project = require("../schema/ProjectSchema");
const User = require("../schema/UserSchema");
const Group = require("../schema/GroupSchema");

/**@ GET request
 * gets all the projects
 * /api/project
 */
const getAllProjects = asynchHandler(async (req, res) => {
  const projects = await Project.find().lean();

  const projectDetails = await Promise.all(
    projects.map(async (project) => {
      const ownerList = await Promise.all(
        project.owner.map(async (owner) => {
          const ownerName = await User.findById(owner)
            .select("fullName")
            .exec();

          return ownerName;
        })
      );

      const memberList = await Promise.all(
        project.members.map(async (member) => {
          const memberName = await User.findById(member)
            .select("fullName")
            .exec();

          return memberName;
        })
      );

      const groupsList = await Promise.all(
        project.groups.map(async (group) => {
          return await Group.findById(group).select();
        })
      );

      const groupDetails = groupsList.map((group) => group);
      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = memberList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
        groupDetails,
      };
    })
  );

  res.status(200).json(projectDetails);
});

/**@ GET request
 * gets all the specific user's projects
 * /api/project/user/:id
 */
const getUserProjects = asynchHandler(async (req, res) => {
  const { id } = req.params;

  const projects = await Project.find({
    $or: [{ owner: id }, { members: id }],
  })
    .lean()
    .exec();

  const projectDetails = await Promise.all(
    projects.map(async (project) => {
      const ownerList = await Promise.all(
        project.owner.map(async (owner) => {
          const ownerName = await User.findById(owner)
            .select("fullName")
            .exec();

          return ownerName;
        })
      );

      const memberList = await Promise.all(
        project.members.map(async (member) => {
          const memberName = await User.findById(member)
            .select("fullName")
            .exec();

          return memberName;
        })
      );

      const groupsList = await Promise.all(
        project.groups.map(async (group) => {
          return await Group.findById(group).select();
        })
      );

      const groupDetails = groupsList.map((group) => group);
      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = memberList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
        groupDetails,
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
  const { title, desc, owner, members } = req.body;

  const newProject = new Project({
    title,
    desc,
    owner,
    members,
  });

  const savedProject = await newProject.save();

  const ownerList = await Promise.all(
    newProject.owner.map(async (owner) => {
      const ownerName = await User.findById(owner).select("fullName").exec();

      return ownerName;
    })
  );

  const memberList = await Promise.all(
    newProject.members.map(async (member) => {
      const memberName = await User.findById(member).select("fullName").exec();

      return memberName;
    })
  );

  const groupDetails = [];

  const ownerName = ownerList.map((owner) => owner.fullName);
  const membersName = memberList.map((member) => member.fullName);

  res
    .status(200)
    .json({ ...savedProject.toObject(), ownerName, membersName, groupDetails });
});

/**@ PATCH request
 * edit project
 * /api/projects/:projectId
 */
const updateProject = asynchHandler(async (req, res) => {
  const { title, desc, owner, members } = req.body;
  const { projectId } = req.params;

  const foundProject = await Project.findById(projectId);

  foundProject.title = title;
  foundProject.desc = desc;
  foundProject.owner = owner;
  foundProject.members = members;

  const result = await foundProject.save();

  const ownerList = await Promise.all(
    result.owner.map(async (owner) => {
      const ownerName = await User.findById(owner).select("fullName").exec();

      return ownerName;
    })
  );

  const memberList = await Promise.all(
    result.members.map(async (member) => {
      const memberName = await User.findById(member).select("fullName").exec();

      return memberName;
    })
  );

  const groupsList = await Promise.all(
    result.groups.map(async (group) => {
      return await Group.findById(group).select();
    })
  );

  const groupDetails = groupsList.map((group) => group);
  const ownerName = ownerList.map((owner) => owner.fullName);
  const membersName = memberList.map((member) => member.fullName);

  if (result === foundProject) {
    res
      .status(200)
      .json({ ...result.toObject(), ownerName, membersName, groupDetails });
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
  // const { groups } = req.body;
  // const { projectId } = req.params;

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

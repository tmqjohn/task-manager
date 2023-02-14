const asynchHandler = require("express-async-handler");

const Project = require("../schema/ProjectSchema");
const User = require("../schema/UserSchema");

/**@ GET request
 * @ gets all the projects
 * TODO: insert group tasks
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

      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = memberList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
      };
    })
  );

  res.json(projectDetails);
});

/**@ GET request
 * @ gets all the user's projects
 * TODO: insert group tasks
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

      const ownerName = ownerList.map((owner) => owner.fullName);
      const membersName = memberList.map((member) => member.fullName);

      return {
        ...project,
        ownerName,
        membersName,
      };
    })
  );

  return res.status(200).json(projectDetails);
});

/**@ POST request
 * @ create new project
 */
const addProject = asynchHandler(async (req, res) => {
  const { title, desc, owner, members } = req.body;

  const newProject = new Project({
    title,
    desc,
    owner,
    members,
  });

  await newProject.save();

  res.json(newProject);
});

/**@ PATCH request
 * @ edit project
 */
const updateProject = asynchHandler(async (req, res) => {
  const { id, title, desc, owner, members } = req.body;

  const foundProject = await Project.findById(id);

  foundProject.title = title;
  foundProject.desc = desc;
  foundProject.owner = owner;
  foundProject.members = members;

  const result = await foundProject.save();

  if (result === foundProject) {
    res.status(200).json({ message: "Successfully updated project" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error updating the project" });
  }
});

/**@ DELETE request
 * @ deletes a project
 */
const deleteProject = asynchHandler(async (req, res) => {
  const { id } = req.body;

  const deletedProject = await Project.findByIdAndDelete(id);

  if (deletedProject) {
    res.status(200).json({ message: "Project has been deleted" });
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
};

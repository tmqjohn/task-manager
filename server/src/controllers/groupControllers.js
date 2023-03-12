const asyncHandler = require("express-async-handler");
const Group = require("../schema/GroupSchema");
const Task = require("../schema/TaskSchema");

/**@ GET request
 * gets all the groups
 * /api/group
 */
const getAllGroups = asyncHandler(async (req, res) => {
  const foundGroups = await Group.find().lean();

  const groupDetails = await Promise.all(
    foundGroups.map(async (group) => {
      const taskDetails = await Promise.all(
        group.tasks.map(async (task) => await Task.findById(task).exec())
      );

      return { ...group, taskDetails };
    })
  );

  return res.status(200).json(groupDetails);
});

/**@ POST request
 * create new group
 * /api/group
 */
const addNewGroup = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const newGroup = await Group.create({
    title,
  });

  return res.status(200).json(newGroup);
});

/**@ PUT request
 * edit and update group
 * /api/group/:groupId
 */
const updateGroup = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { groupId } = req.params;

  const foundGroup = await Group.findById(groupId).exec();

  foundGroup.title = title;

  const result = await foundGroup.save();

  if (result === foundGroup) {
    res.status(200).json(result);
  } else {
    res.status(400).json({ message: "There was an error updating the group" });
  }
});

/**@ DELETE request
 * delete a request
 * /api/group/:groupId
 */
const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const deletedGroup = await Group.findByIdAndDelete(groupId);

  if (deletedGroup) {
    res.status(200).json({ message: "Group has been deleted" });
  } else {
    res.status(400).json({ message: "There was an error deleting the group" });
  }
});

/**@ PATCH request
 * add tasksId to a group
 * /api/group/tasks/add
 */
const addGroupTask = asyncHandler(async (req, res) => {
  const { groupId, tasks } = req.body;

  const foundGroup = await Group.findById(groupId).select("tasks").exec();

  foundGroup.tasks = [...foundGroup.tasks, tasks];

  const result = await foundGroup.save();

  if (result === foundGroup) {
    res.status(200).json({ message: "Task has been added successfully" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error updating the project" });
  }
});

/**@ PUT request
 * delete groups linked from a deleted project
 * /api/group/project
 */
const deleteAllGroup = asyncHandler(async (req, res) => {
  const { groupIds } = req.body;

  const result = await Group.deleteMany({ _id: groupIds });

  if (result.acknowledged) {
    res.status(200).json({
      message:
        "Groups associated with the deleted project has been deleted successfully",
    });
  } else {
    res.status(400).json({ message: "There was an error deleting the groups" });
  }
});

/**@ PATCH request
 * delete delete a task from a group
 * /api/group/tasks/delete/:groupId
 */
const deleteGroupTask = asyncHandler(async (req, res) => {
  const { taskId } = req.body;
  const { groupId } = req.params;

  const foundGroup = await Group.findById(groupId).select("tasks").exec();

  foundGroup.tasks = foundGroup.tasks.filter((task) => task != taskId);

  const result = await foundGroup.save();

  if (result === foundGroup) {
    res.status(200).json({ message: "Task removed successfully" });
  } else {
    res
      .status(400)
      .json({ message: "There was an error deleting the project" });
  }
});

module.exports = {
  getAllGroups,
  addNewGroup,
  updateGroup,
  deleteGroup,
  addGroupTask,
  deleteAllGroup,
  deleteGroupTask,
};

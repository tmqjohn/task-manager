const asyncHandler = require("express-async-handler");
const Group = require("../schema/GroupSchema");

/**@ GET request
 * gets all the groups
 * /api/group
 */
const getAllGroups = asyncHandler(async (req, res) => {
  const foundGroups = await Group.find().lean();

  res.status(200).json(foundGroups);
});

/**@ POST request
 * create new group
 * /api/group
 */
const addNewGroup = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const newGroup = new Group({
    title,
  });

  const savedGroup = await newGroup.save();

  res.status(200).json(savedGroup);
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
    res.status(200).json(result.toObject());
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

module.exports = {
  getAllGroups,
  addNewGroup,
  updateGroup,
  deleteGroup,
  deleteAllGroup,
};

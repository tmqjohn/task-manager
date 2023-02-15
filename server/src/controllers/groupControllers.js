const asyncHandler = require("express-async-handler");
const Group = require("../schema/GroupSchema");

/**@ GET request
 * @ gets all the groups
 */
const getAllGroups = asyncHandler(async (req, res) => {
  res.send("@GET request");
});

/**@ POST request
 * @ create new group
 */
const addNewGroup = asyncHandler(async (req, res) => {
  res.send("@POST request");
});

/**@ PUT request
 * @ edit and update group
 */
const updateGroup = asyncHandler(async (req, res) => {
  res.send("@PUT request");
});

/**@ DELETE request
 * @ delete a request
 */
const deleteGroup = asyncHandler(async (req, res) => {
  res.send("@DELETE request");
});

module.exports = {
  getAllGroups,
  addNewGroup,
  updateGroup,
  deleteGroup,
};

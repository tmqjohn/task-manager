const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../helpers/password");

const User = require("../schema/UserSchema");

/**@ POST request
 * @ adds new user
 */
const addNewUser = asyncHandler(async (req, res) => {
  const { username, password, fullName, email } = req.body;

  const foundUsername = await User.findOne({ username }).exec();
  const foundEmail = await User.findOne({ email }).exec();

  if (foundUsername || foundEmail) {
    return res
      .status(400)
      .json({ message: "This username or email has already been registered" });
  }

  const hashedPassword = hashPassword(password);

  await User.create({
    username,
    password: hashedPassword,
    fullName,
    email,
  });

  return res.status(201).json({ message: "Registration successfully" });
});

/**@ PUT request
 * @ edit user
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id, password } = req.body;

  const foundUser = await User.findById(id).exec();

  if (password) {
    foundUser.password = hashPassword(password);
  }

  const result = await foundUser.save();

  res.send(result);
});

module.exports = {
  addNewUser,
  updateUser,
};

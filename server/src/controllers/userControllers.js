const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { checkPassword, hashPassword } = require("../helpers/password");

const User = require("../schema/UserSchema");

/**@ GET request
 * @ get all the users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const foundUsers = await User.find().select("-password").lean().exec();

  if (!foundUsers) {
    return res.status(404).json({ message: "There is no existing user" });
  }

  return res.status(200).json(foundUsers);
});

/**@ GET request
 * @ get specific user details
 */
const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (username === "")
    return res.status(404).json({ message: "Invalid username" });

  const foundUser = await User.findOne({ username })
    .select(["-password", "-createdAt", "-updatedAt"])
    .lean()
    .exec();

  if (!foundUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(foundUser);
});

/**@ POST request
 * @ login user with JWT token
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  /**TODO: merge incorrect username and password */

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(404).json({ message: "Username not found" });
  }

  const verifiedPassword = await checkPassword(password, foundUser.password);

  if (!verifiedPassword) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign(
    {
      userId: foundUser._id,
      username: foundUser.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    message: "Login successful",
    username: foundUser.username,
    token,
  });
});

/**@ POST request
 * @ register new user
 */
const registerNewUser = asyncHandler(async (req, res) => {
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
 * @ edit user details
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id, password, email, fullName } = req.body;

  const foundUser = await User.findById(id).exec();

  if (password) {
    foundUser.password = hashPassword(password);
  }

  foundUser.email = email;
  foundUser.fullName = fullName;

  const result = await foundUser.save();

  if (result === foundUser) {
    return res.status(200).json({ message: "User successfully updated" });
  } else {
    return res.status(400).json({ message: "There was error updating user" });
  }
});

module.exports = {
  getAllUsers,
  getUser,
  loginUser,
  registerNewUser,
  updateUser,
};

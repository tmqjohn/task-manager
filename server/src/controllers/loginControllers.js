const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { checkPassword } = require("../helpers/password");

const User = require("../schema/UserSchema");

/**@ GET request
 * @ gets all the users
 * @ TODO: DELETE THIS GET REQUEST FROM REGISTER ROUTE
 */
const getUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const foundUser = await User.find({}).select("-password").lean().exec();

  if (foundUser) {
    return res.status(200).json(foundUser);
  } else {
    return res.status(404).json({ message: "There is no existing user" });
  }
});

/**@ POST request
 * @ login request wiht JWT token
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(404).json({ message: "Username not found" });
  }

  const verifyPassword = await checkPassword(password, foundUser.password);

  if (!verifyPassword) {
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

module.exports = { getUser, loginUser };

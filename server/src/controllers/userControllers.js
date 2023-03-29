const asyncHandler = require("express-async-handler");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const { checkPassword, hashPassword } = require("../helpers/password");
const initMail = require("../helpers/mailer");

const User = require("../schema/UserSchema");

/**@ GET request
 * get all the users
 * /api/auth/user
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
 * /api/auth/user/:username
 */
const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (username === "")
    return res.status(404).json({ message: "Invalid username" });

  let foundUser = await User.findOne({
    $or: [{ username }, { email: username }],
  })
    .lean()
    .exec();

  if (!foundUser) {
    try {
      foundUser = await User.findById(username).lean().exec();
    } catch (error) {
      return res.status(404).json({ message: "User not found" });
    }
  }

  return res.status(200).json(foundUser);
});

/**@ POST request
 * @ login user, return JWT token
 * /api/auth/user/login
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

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
    token,
  });
});

/**@ POST request
 * @ login user using google login, return JWT token
 * /api/auth/user/loginGoogle
 */
const googleLoginUser = asyncHandler(async (req, res) => {
  const { googleId } = req.body;

  const foundUser = await User.findOne({ username: googleId }).exec();

  if (!foundUser) {
    return res.status(404).json({ message: "Google account not registered" });
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
    token,
  });
});

/**@ POST request
 * @ register new user
 * /api/auth/user/register
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

  return res.status(201).json({ message: "Registration successful" });
});

/**@ POST request
 * @ register new google uiser
 * /api/auth/user/registerGoogle
 */
const registerNewGoogleUser = asyncHandler(async (req, res) => {
  const { googleId, email, fullName } = req.body;

  const foundEmail = await User.findOne({ email }).exec();

  if (foundEmail) {
    return res
      .status(400)
      .json({ message: "The google email has already been registered" });
  }

  await User.create({
    username: googleId,
    email,
    fullName,
    googleId,
  });

  return res.status(201).json({ message: "Registration Successful" });
});

/**@ PUT request
 * @ edit user details
 * /api/auth/user/:username
 */
const updateUser = asyncHandler(async (req, res) => {
  const { password, email, fullName } = req.body;
  const { username } = req.params;

  const foundUser = await User.findOne({ username }).exec();

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

/**@ POST request
 * @ generate OTP
 * /api/auth/user/recovery/generateOTP
 */
const generateOtp = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    return res.status(404).json({ message: "Username Not Found" });
  }

  req.app.locals.OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  req.app.locals.resetSession = false;

  initMail(username, req.app.locals.OTP, foundUser.email);

  return res.status(200).send({ message: "Code has been sent to your email!" });
});

/**@ POST request
 * @ verify OTP
 * /api/auth/user/recover/verifyOTP
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (parseInt(code) != parseInt(req.app.locals.OTP)) {
    return res.status(400).send({ message: "Invalid Code" });
  }

  req.app.locals.OTP = null;
  req.app.locals.resetSession = true;

  return res.status(200).send({ message: "Code verification successful!" });
});

/**@ PUT request
 * reset password
 * /api/auth/user/resetPassword/:username
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { username } = req.params;

  const foundUser = await User.findOne({ username })
    .select([, "-createdAt", "-updatedAt", "-email", "-username", "-fullName"])
    .exec();

  const verifiedPassword = await checkPassword(password, foundUser.password);

  if (verifiedPassword) {
    return res.status(400).json({
      message: "You already used this password once. Please try a new password",
    });
  }

  foundUser.password = hashPassword(password);

  const result = await foundUser.save();

  if (result === foundUser) {
    req.app.locals.resetSession = false;

    return res.status(200).json({ message: "Password successfully reset!" });
  } else {
    return res
      .status(400)
      .json({ message: "There was error resetting user's password" });
  }
});

module.exports = {
  getAllUsers,
  getUser,
  loginUser,
  googleLoginUser,
  registerNewUser,
  registerNewGoogleUser,
  updateUser,
  generateOtp,
  verifyOtp,
  resetPassword,
};

const asyncHandler = require("express-async-handler");

const resetSession = asyncHandler(async (req, res, next) => {
  if (!req.app.locals.resetSession) {
    return res.status(400).send({ message: "Session Expired" });
  }

  req.app.locals.resetSession = false;

  next();
});

module.exports = resetSession;

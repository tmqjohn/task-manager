const bcrypt = require("bcrypt");

function hashPassword(password) {
  const saltRounds = bcrypt.genSaltSync();

  return bcrypt.hashSync(password, saltRounds);
}

async function checkPassword(password, hashedPassword) {
  const result = await bcrypt.compare(password, hashedPassword);

  return result;
}

module.exports = {
  hashPassword,
  checkPassword,
};

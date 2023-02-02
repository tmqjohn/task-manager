const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectToMongoDB() {
  try {
    return mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = connectToMongoDB;

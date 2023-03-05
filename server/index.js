require("dotenv").config();

const { server, PORT } = require("./src/server");
const connectToMongoDB = require("./src/config/dbConn");

connectToMongoDB()
  .then(() => {
    console.log("Successfully Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch((error) => console.error(error.message));

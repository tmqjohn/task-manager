require("dotenv").config();

// initialize server and connecting to database modules
const { server, PORT } = require("./src/server");
const connectToMongoDB = require("./src/config/dbConn");

// start the server
connectToMongoDB()
  .then(() => {
    console.log("Successfully Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch((error) => console.error(error.message));

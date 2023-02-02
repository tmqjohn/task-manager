require("dotenv").config();

const { app, PORT } = require("./src/server");
const connectToMongoDB = require("./src/config/dbConn");

connectToMongoDB()
  .then(() => {
    console.log("Successfully Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  })
  .catch((error) => console.error(error.message));

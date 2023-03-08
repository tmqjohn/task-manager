const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const bodyParser = require("body-parser");
const helmet = require("helmet");

const cors = require("cors");
const corsOptions = require("./config/cors/corsOptions");

const routes = require("./routes/route");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: PORT,
  },
});

app.use(helmet());

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize server routes
app.use("/", routes);

// socket events
io.on("connection", (socket) => {
  console.log(`new connection: ${socket.id}`);

  socket.on("join-room", (data) => {
    if (socket.rooms.has(data.prevProjectId)) {
      socket.leave(data.prevProjectId);
    }

    socket.join(data.projectId);
  });

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

module.exports = { server, PORT };

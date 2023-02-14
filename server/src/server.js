const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const cors = require("cors");
const corsOptions = require("./config/cors/corsOptions");

const routes = require("./routes/route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//initialize server routes
app.use("/", routes);

module.exports = { app, PORT };

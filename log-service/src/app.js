const express = require("express");
const cors = require("cors");

const logRoutes = require("./routes/logRoutes");
const { log } = require("node:console");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/logs", logRoutes);

module.exports = app;
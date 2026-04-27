const express = require("express");
const cors = require("cors");

const datasetRoutes = require("./routes/datasetRoutes");
const datasetReportRoutes = require("./routes/datasetReportRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/datasets", datasetRoutes);
app.use("/api/reports", datasetReportRoutes);

module.exports = app;
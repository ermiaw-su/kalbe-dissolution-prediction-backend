const express = require("express");
const cors = require("cors");
const path = require("path");

const predictionRoutes = require("./routes/predictionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/graphs",
    express.static(
        "/app/thesisPython/Baseline_PCA_Models_Result"
    )
);

app.use("/api/predictions", predictionRoutes);

module.exports = app;
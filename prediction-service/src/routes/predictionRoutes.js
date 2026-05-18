const express = require("express");

const router = express.Router();

const predictionController = require("../controllers/predictionController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

router.post(
    "/run",
    verifyToken,
    predictionController.runPrediction
);

router.get(
    "/",
    verifyToken,
    predictionController.getPredictions
);

router.get(
    "/:id",
    verifyToken,
    predictionController.getPredictionById
);

module.exports = router;
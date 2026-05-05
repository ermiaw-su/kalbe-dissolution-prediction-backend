const express = require("express");
const router = express.Router();
const {verifyToken, isAdmin} = require("../middleware/authMiddleware")

const logController = require("../controllers/logController");

router.post("/", async (req, res) => {
    try {
        const ActivityLog = require("../models/ActivityLog");

        const log = await ActivityLog.create(req.body);

        res.status(201).json({
            message: "Log created",
            data: log
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create log",
            error: error.message
        });
    }
});

router.get("/", verifyToken, isAdmin, logController.getActivityLogs)

module.exports = router
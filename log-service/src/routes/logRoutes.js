const express = require("express");
const router = express.Router();
const {verifyToken, isAdmin} = require("../middleware/authMiddleware")

const logController = require("../controllers/logController");

router.get("/", verifyToken, isAdmin, logController.getActivityLogs)

module.exports = router
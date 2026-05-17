const express = require("express");
const router = express.Router();

const {
    getDatasetReports,
    updateDatasetReport,
    createDatasetReport
} = require("../controllers/datasetReportController");

const uploadReport = require("../middleware/reportUploadMiddleware");

const { verifyToken } = require("../middleware/authMiddleware");

router.post(
    "/upload",
    verifyToken,
    uploadReport.single("report"),
    createDatasetReport
);

router.get("/", verifyToken, getDatasetReports);

router.put("/archive/:id", verifyToken, updateDatasetReport);

module.exports = router;
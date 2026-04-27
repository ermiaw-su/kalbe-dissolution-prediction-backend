const DatasetReport = require("../models/DatasetReport");
const logActivity = require("../utils/logActivity");

// GET REPORTS
exports.getDatasetReports = async (req, res) => {
    try {
        const reports = await DatasetReport.find({ statusReport: "Active" })
            .sort({ createdAt: -1 });

        res.json({
            count: reports.length,
            data: reports
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching reports",
            error: error.message
        });
    }
};

// ARCHIVE REPORT
exports.updateDatasetReport = async (req, res) => {
    try {
        const report = await DatasetReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                message: "Dataset report not found"
            });
        }

        report.statusReport = "Archived";
        await report.save();

        await logActivity(
            "ARCHIVE_DATASET_REPORT",
            `Archived report for dataset ${report.datasetName}`,
            req.user
        );

        res.json({
            message: "Dataset report archived"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating report",
            error: error.message
        });
    }
};
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const reportDir = "/app/shared-reports";

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir);
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, reportDir);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            `report_${Date.now()}.pdf`;

        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(
            new Error("Only PDF files are allowed"),
            false
        );
    }
};

const uploadReport = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 1024 * 1024 * 20
    }
});

module.exports = uploadReport;
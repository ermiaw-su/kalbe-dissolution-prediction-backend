const fs = require("fs")
const path = require("path")

const Dataset = require("../models/Dataset")
const logActivity = require("../utils/logActivity")
const { validateFile } = require("../utils/fileValidator")

// UPLOAD DATASET 
exports.uploadDataset = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        // validate file content
        let data;
        try {
            data = await validateFile(file.path);
        } catch (error) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return res.status(400).json({
                message: error.message
            });
        }

        if (!data || data.length === 0) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            return res.status(400).json({
                message: "Dataset is empty or invalid"
            });
        }

        const dataset = await Dataset.create({
            fileName: file.filename,
            originalName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            rowCount: data.length,
            uploadedBy: req.user.id
        });

        await logActivity(
            "UPLOAD_DATASET",
            `Uploaded dataset ${dataset.originalName}`,
            req.user
        );

        res.status(201).json({
            message: "File uploaded successfully",
            dataset
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error uploading dataset",
            error: error.message
        });
    }
};

// GET ALL DATASETS
exports.getDatasets = async (req, res) => {
    try{
        const datasets = await Dataset.find().populate("uploadedBy", "username").sort({ uploadTime: -1 })

        res.status(200).json({
            count: datasets.length,
            datasets
        })
    } catch (error) {
        res.status(500).json({
            message: "Error getting datasets",
            error: error.message
        })
    }
}

// GET DATASET BY ID
exports.getDatasetById = async (req, res) => {
    try{
        const dataset = await Dataset.findById(req.params.id)
        if(!dataset) {
            return res.status(404).json({
                message: "Dataset not found"
            })
        }

        res.status(200).json(dataset)
    } catch (error) {
        res.status(500).json({
            message: "Error getting dataset",
            error: error.message
        })
    }
}

// UPDATE DATASET
exports.updateDataset = async (req, res) => {
    try{
        const dataset = await Dataset.findById(req.params.id)
        if(!dataset) {
            return res.status(404).json({
                message: "Dataset not found"
            })
        }

        await dataset.updateOne(req.body)

        await logActivity(
            "UPDATE_DATASET",
            `Updated dataset ${dataset.originalName}`,
            req.user
        )
        res.status(200).json({
            message: "Dataset updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating dataset",
            error: error.message
        })
    }
}

// DELETE DATASET
exports.deleteDataset = async (req, res) => {
    try{
        const dataset = await Dataset.findById(req.params.id)
        if(!dataset) {
            return res.status(404).json({
                message: "Dataset not found"
            })
        }

        const filepath = path.join(__dirname, "../..", dataset.filePath)
        if(fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
        }

        await dataset.deleteOne()

        await logActivity(
            "DELETE_DATASET",
            `Deleted dataset ${dataset.originalName}`,
            req.user
        )
        res.status(200).json({
            message: "Dataset deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting dataset",
            error: error.message
        })
    }
};
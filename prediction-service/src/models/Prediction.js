const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({

    datasetId: {
        type: String,
        required: true
    },

    datasetName: {
        type: String,
        required: true
    },

    generatedBy: {
        type: String,
        required: true
    },

    generatedByName: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Processing", "Completed", "Failed"],
        default: "Processing"
    },

    representativeBatch: {
        type: String,
        default: null
    },

    representativePlot: {
        type: String,
        default: null
    },

    representativeResult: {
        type: Array,
        default: []
    },

    resultTable: {
        type: Array,
        default: []
    },

    processingTime: {
        type: Number,
        default: 0
    },

    errorMessage: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Prediction",
    predictionSchema
);
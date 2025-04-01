const mongoose = require('mongoose');

const comsTableSchema = new mongoose.Schema({
    CO_COMS_Id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // MongoDB system-generated ID
    CO_UniqueFileName: { type: String, required: true, unique: true }, // Unique filename
    CO_Creation_DtTym: { type: String, required: true }, // Timestamp in YYYYMMDDHHMMSS format
    CO_UniqueFilePath: { type: String, default: null }, // Optional file path
    CO_Channel: { type: Number, required: true, enum: [1, 2, 3, 4] }, // 1: MQ, 2: CSV, 3: Flat File, 4: API (https)
    CO_Status: { type: Number, required: true, enum: [1, 2, 3, 4, 5] }, // 1: Received, 2: Processed Successfully, 3: Partially Processed, 4: Technical Reject, 5: Business Reject
    CO_Field1: { type: String, default: null },
    CO_Field2: { type: String, default: null },
    CO_Field3: { type: String, default: null },
    CO_Field4: { type: String, default: null },
    CO_Field5: { type: String, default: null },
    CO_Field6: { type: String, default: null },
    CO_Field7: { type: String, default: null },
    CO_Field8: { type: String, default: null },
    CO_Field9: { type: String, default: null },
    CO_Field10: { type: String, default: null },
    CO_Field11: { type: String, default: null },
    CO_Field12: { type: String, default: null },
    CO_Field13: { type: String, default: null },
    CO_Field14: { type: String, default: null },
    CO_Field15: { type: String, default: null },
    CO_Field16: { type: String, default: null },
    CO_Field17: { type: String, default: null },
    CO_Field18: { type: String, default: null },
    CO_Field19: { type: String, default: null },
    CO_Field20: { type: String, default: null },
    CO_Field21: { type: String, default: null },
    CO_Field22: { type: String, default: null },
    CO_Field23: { type: String, default: null },
    CO_Field24: { type: String, default: null },
    CO_Field25: { type: String, default: null },
    CO_Field26: { type: String, default: null },
    CO_Field27: { type: String, default: null },
    CO_Field28: { type: String, default: null },
    CO_Field29: { type: String, default: null },
    CO_Field30: { type: String, default: null }
}, { timestamps: true });

const ComsTable = mongoose.models.ComsTable || mongoose.model('ComsTable', comsTableSchema);

module.exports = ComsTable;

import mongoose from "mongoose";

const HCJBulkImportSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    uploadedBy: { type: String, required: true }, // Admin who uploaded
    uploadDate: { type: Date, default: Date.now },
    csvUrl: { type: String, required: true }, // Google Drive link of golden copy
    validCount: { type: Number, default: 0 },
    invalidCount: { type: Number, default: 0 },
    duplicateCount: { type: Number, default: 0 },
    invalidCsvUrl: { type: String }, // Link to invalid students CSV
  },
  { collection: "hcj_bulk_imports" }
);

const HCJBulkImport =
  mongoose.models.HCJBulkImport || mongoose.model("HCJBulkImport", HCJBulkImportSchema);

export default HCJBulkImport;

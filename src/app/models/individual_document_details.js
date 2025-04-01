import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * @typedef {Object} DocumentDetailsSchema
 * @property {mongoose.Schema.Types.ObjectId} IDD_Document_Id - Auto-generated unique identifier for the document.
 * @property {mongoose.Schema.Types.ObjectId} IDD_Individual_Id - Foreign key reference to the IndividualDetails schema.
 * @property {String} IDD_Username - Username (email or phone number). Required status to be updated later.
 * @property {String} IDD_Document1_Domicile - Document domicile country code (ISO 3166-1 alpha-3). Required.
 * @property {String} IDD_Document1_Type - Document type (from 01 to 45 based on predefined list). Required.
 * @property {String} IDD_Document1_Unq_Identifier - Unique identifier for the document. Required.
 * @property {Date} IDD_Uploaded1_DtTym - Date and time of document upload. Required.
 * @property {String} IDD_Uploaded1_By - User ID of the uploader (to be updated to required after login setup).
 * @property {String} IDD_Verified1_Status - Verification status (01: Yes, 02: No, 03: Requires investigation, 04: Rejected). Default: 02 (No).
 * @property {String} IDD_Verified1_By - User ID of the verifier (Super Admin verification).
 * @property {String} IDD_Individual1_Document - Document file name/path. Required after verification.
 * @property {String} IDD_Document2_Domicile - Second document domicile country code (ISO 3166-1 alpha-3).
 * @property {String} IDD_Document2_Type - Second document type (01 to 45).
 * @property {String} IDD_Document2_Unq_Identifier - Unique identifier for the second document.
 * @property {Date} IDD_Uploaded2_DtTym - Date and time of second document upload.
 * @property {String} IDD_Uploaded2_By - User ID of the second document uploader.
 * @property {String} IDD_Verified2_Status - Second document verification status (01: Yes, 02: No, 03: Requires investigation, 04: Rejected).
 * @property {String} IDD_Verified2_By - User ID of the second document verifier.
 * @property {String} IDD_Individual2_Document - Second document file name/path.
 * @property {String} IDD_Session_Id - Session ID to track document submission.
 * @property {Date} IDD_Creation_DtTym - Timestamp when the document entry was created.
 * @property {Array.<AuditTrailSchema>} IDD_Audit_Trail - Array of audit trail records for tracking modifications.
 * @property {Date} createdAt - Auto-generated timestamp for document creation.
 * @property {Date} updatedAt - Auto-generated timestamp for last update.
 */

const DocumentDetailsSchema = new mongoose.Schema(
  {
  //  IDD_Document_Id: { type: mongoose.Schema.Types.ObjectId, auto: true,},
    IDD_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'IndividualDetails', // Reference to IndividualDetails schema
    },
    IDD_Username: {
      type: String,
      required: true, // Will update to true later
    },
    IDD_Document1_Domicile: {
      type: String,
      required: true, // ISO 3166-1 alpha-3 country code
    },
    IDD_Document1_Type: {
      type: String,
      required: true, // Predefined values 01 to 45
    },
    IDD_Document1_Unq_Identifier: {
      type: String,
      required: true, // Unique document identifier
    },
    IDD_Uploaded1_DtTym: {
      type: Date,
      required: true,
    },
    IDD_Uploaded1_By: {
      type: String,
      required: false, // Will update to true after login setup
    },
    IDD_Verified1_Status: {
      type: String,
      enum: ['01', '02', '03', '04'], // Verification statuses
      default: '02', // Default: No
      required: true,
    },
    IDD_Verified1_By: {
      type: String,
      required: false, // Verified by Super Admin
    },
    IDD_Individual1_Document: {
      type: String,
      required: true, // Document filename/path
    },
    IDD_Document2_Domicile: {
      type: String,
      required: false,
    },
    IDD_Document2_Type: {
      type: String,
      required: false,
    },
    IDD_Document2_Unq_Identifier: {
      type: String,
      required: false,
    },
    IDD_Uploaded2_DtTym: {
      type: Date,
      required: false,
    },
    IDD_Uploaded2_By: {
      type: String,
      required: false,
    },
    IDD_Verified2_Status: {
      type: String,
      enum: ['01', '02', '03', '04'],
      required: false,
    },
    IDD_Verified2_By: {
      type: String,
      required: false,
    },
    IDD_Individual2_Document: {
      type: String,
      required: false,
    },
    IDD_Session_Id: {
      type: String,
      required: false,
    },
    IDD_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    IDD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure schema is not recompiled
// export default mongoose.models.DocumentDetails ||
//   mongoose.model('individual_Document_Detail', DocumentDetailsSchema);

const DocumentDetails =
  mongoose.models["individual_Document_Detail"] ||
  mongoose.model("individual_Document_Detail", DocumentDetailsSchema);

export default DocumentDetails;

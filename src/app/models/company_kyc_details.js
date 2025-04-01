import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";


/**
 * Schema for Company KYC Document Details.
 *
 * @typedef {Object} company_kyc_document_detailsSchema
 * @property {mongoose.Schema.Types.ObjectId} CKD_KYC_Id - Unique identifier for the KYC record.
 * @property {String} CKD_KYCNum - Unique KYC number assigned to the company.
 * @property {mongoose.Schema.Types.ObjectId} CKD_Company_Id - Reference to the associated company.
 * @property {String} CKD_Company_Registration_Number - Unique company registration number (e.g., GST, Business License).
 * @property {Buffer} CKD_Company_Registration_Documents - Registration documents uploaded by the company.
 * @property {String} CKD_Company_Tax_Id - Unique tax identification number of the company.
 * @property {Buffer} CKD_Company_Tax_Documents - Tax-related documents uploaded by the company.
 * @property {String} CKD_Submitted_By - User ID of the person who submitted the KYC details.
 * @property {Date} CKD_Submission_DtTym - Timestamp when the KYC details were submitted.
 * @property {String} CKD_Verification_Status - Status of the verification process (e.g., Submitted, Verified, Rejected).
 * @property {Date} CKD_Verification_DtTym - Timestamp of the verification update.
 * @property {String} CKD_Verified_By - User ID of the person who verified the KYC.
 * @property {String} CKD_KYC_History - History log of KYC verification.
 * @property {String} CKD_Remarks - Remarks provided by the verifier.
 * @property {Number} CKD_Session_Id - Identifier for the session during which KYC was submitted.
 * @property {Date} CKD_Creation_DtTym - Date and time when the KYC record was created.
 * @property {Array.<AuditTrailSchema>} CKD_Audit_Trail - Audit trail information for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const company_kyc_document_detailsSchema = new mongoose.Schema(
  {
  //  CKD_KYC_Id: {  type: mongoose.Schema.Types.ObjectId,  auto: true, },
    CKD_KYCNum: { type: String, unique: true, required: true },
    CKD_Company_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company_details",
      required: true,
    },

  //  Need To be add in table

    CKD_Institution_Type: { type: String, required: false },  // New
    CKD_AISHE_Code: { type: String, required: false }, // New
    CKD_College_Name: { type: String }, // New
    CKD_College_Name_Other: { type: String }, // New
    CKD_Affiliated_University: { type: String }, // New
    CKD_Affiliated_University_Other: { type: String }, // New
    CKD_University_Name: { type: String }, // New
    CKD_University_Name_Other: { type: String }, // New
    CKD_University_Type: { type: String }, // New

    CKD_Company_Registration_Number: { type: String, required: true, unique: true },
    CKD_Company_Registration_Documents: { type: String }, // Mandatory
    CKD_Company_Tax_Id: { type: String, required: true, unique: true }, 
    CKD_Company_Tax_Documents: { type: String, required: true,  }, // Mandatory
    CKD_Submitted_By: { type: String, required: true }, // Mandatory
    CKD_Submission_DtTym: { type: Date, required: true, default: Date.now },
    CKD_Verification_Status: { type: String, required: true, default: "submitted" },
    CKD_Verification_DtTym: { type: Date },
    CKD_Verified_By: { type: String },
    CKD_KYC_History: { type: String },
    CKD_Remarks: { type: String },
    CKD_Session_Id: { type: Number },
    CKD_Creation_DtTym: { type: Date, default: Date.now },
    CKD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

export default mongoose.models.company_kyc_document_details ||
  mongoose.model("company_kyc_document_details", company_kyc_document_detailsSchema);

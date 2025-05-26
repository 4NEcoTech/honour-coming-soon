import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Job Applications.
 *
 * @typedef {Object} HcjJobApplicationSchema
 * @property {String} HCJ_AT_Application_Id - Unique ID of the application.
 * @property {String} HCJ_AT_Applicant_Id - ID of the applicant.
 * @property {String} HCJ_AT_Job_Id - ID of the job.
 * @property {String} HCJ_AT_Applicant_First_Name - First name of the applicant.
 * @property {String} HCJ_AT_Applicant_Last_Name - Last name of the applicant.
 * @property {String} HCJ_AT_Applicant_Email - Email of the applicant.
 * @property {String} HCJ_AT_Applicant_Phone_Number - Phone number of the applicant.
 * @property {String} HCJ_AT_Applicant_Type - Type of the applicant.
 * @property {String} HCJ_AT_Application_Status - Status of the application.
 * @property {String} HCJ_AT_Cover_Letter - Cover letter provided by the applicant.
 * @property {String} HCJ_AT_Upload_Resume - Uploaded resume.
 * @property {String} HCJ_JA_Job_Created_By - ID of the user who created the job.
 * @property {Date} HCJ_JA_Job_Created_At - Date when the job was created.
 * @property {String} HCJ_Job_JA_Applied_By - ID of the user who applied for the job.
 * @property {Date} HCJ_AT_Applied_At - Date when the application was submitted.
 * @property {String} HCJ_AT_Session_Id - Session ID.
 * @property {Date} HCJ_AT_Creation_DtTym - Timestamp when the application was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AT_Audit_Trail - Audit trail of the application.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */

// 01 Received
// 02 Shortlisted
// 03 Hired
// 04 Rejected

const hcjJobApplicationSchema = new Schema(
  {
    HCJ_AT_Applicant_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "IndividualDetails",
    },
    HCJ_AT_Job_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "hcj_job_postings", // Reference to IndividualDetails schema
    },
    HCJ_AT_Applicant_First_Name: { type: String, required: true },
    HCJ_AT_Applicant_Last_Name: { type: String, required: true },
    HCJ_AT_Applicant_Email: { type: String, required: true },
    HCJ_AT_Applicant_Phone_Number: { type: String, required: true },
    HCJ_AT_Applicant_Type: { type: String, required: true },
    HCJ_AT_Application_Status: { type: String, required: true },
    HCJ_AT_Cover_Letter: { type: String },
    HCJ_AT_Upload_Resume: { type: String },
    HCJ_JA_Job_Created_By: { type: String, required: true },
    HCJ_JA_Job_Created_At: { type: Date },
    HCJ_Job_JA_Applied_By: { type: String, required: true },
    HCJ_AT_Applied_At: { type: Date },
    HCJ_AT_Session_Id: { type: String },
    HCJ_AT_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_AT_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJobApplication =
  mongoose.models.hcj_job_applications ||
  mongoose.model("hcj_job_applications", hcjJobApplicationSchema);

export default HcjJobApplication;

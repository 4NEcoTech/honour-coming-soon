import mongoose from "mongoose";
import { AuditTrailSchema } from "../common/AuditTrail";

/**
 * Schema for Patents held by Job Seekers.
 *
 * @typedef {Object} hcj_job_seeker_patentSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSP_Job_Seeker_Id - Reference to the job seeker holding the patent.
 * @property {String} HCJ_JSP_Patent_Area - Domain or subject area of the patent (e.g., Chemistry, Biomedical).
 * @property {String} HCJ_JSP_Patent_Name - Official name/title of the patent.
 * @property {String} HCJ_JSP_Patent_Url - URL link to the official patent listing or documentation.
 * @property {Date} HCJ_JSP_Patent_Date - Date the patent was granted or filed.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSP_Updated_By - ID of the user who last updated the record.
 * @property {Number} HCJ_JSP_Session_Id - Session ID for tracking context.
 * @property {Date} HCJ_JSP_Creation_DtTym - Date and time the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JSP_Audit_Trail - Technical audit logs.
 * @property {Date} createdAt - Mongoose auto-managed creation timestamp.
 * @property {Date} updatedAt - Mongoose auto-managed update timestamp.
 */

const hcjJobSeekerPatentSchema = new mongoose.Schema(
  {
    HCJ_JSP_Job_Seeker_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hcj_job_seeker",
      required: true,
    },
    HCJ_JSP_Patent_Area: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JSP_Patent_Name: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JSP_Patent_Url: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JSP_Patent_Date: {
      type: Date,
      required: true,
    },
    HCJ_JSP_Updated_By: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_table",
      required: true,
    },
    HCJ_JSP_Session_Id: {
      type: Number,
      required: true,
    },
    HCJ_JSP_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_JSP_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.models.hcj_job_seeker_patent ||
  mongoose.model("hcj_job_seeker_patent", hcjJobSeekerPatentSchema);

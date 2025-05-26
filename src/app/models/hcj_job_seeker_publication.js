import mongoose from "mongoose";
import { AuditTrailSchema } from "../common/AuditTrail";

/**
 * Schema for Publications associated with Job Seekers.
 *
 * @typedef {Object} hcj_job_seeker_publicationSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JP_Job_Seeker_Id - Reference to the job seeker.
 * @property {String} HCJ_JP_Publication_Area - Subject/domain of the publication (e.g., Chemistry, AI, Medicine).
 * @property {String} HCJ_JP_Publication_Journal - Name of the journal or conference.
 * @property {String} HCJ_JP_Publication_Name - Title of the publication.
 * @property {String} HCJ_JP_Publication_Url - URL to the full publication or research paper.
 * @property {Date} HCJ_JP_Publication_Date - Date when the publication was released.
 * @property {Number} HCJ_JP_Session_Id - Session identifier.
 * @property {Date} HCJ_JP_Creation_DtTym - Record creation timestamp.
 * @property {Array.<AuditTrailSchema>} HCJ_JP_Audit_Trail - Audit log.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const hcjJobSeekerPublicationSchema = new mongoose.Schema(
  {
    HCJ_JP_Job_Seeker_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hcj_job_seeker",
      required: true,
    },
    HCJ_JP_Publication_Area: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JP_Publication_Journal: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JP_Publication_Name: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JP_Publication_Url: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JP_Publication_Date: {
      type: Date,
      required: true,
    },
    HCJ_JP_Session_Id: {
      type: Number,
      required: true,
    },
    HCJ_JP_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_JP_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.hcj_job_seeker_publication ||
  mongoose.model("hcj_job_seeker_publication", hcjJobSeekerPublicationSchema);

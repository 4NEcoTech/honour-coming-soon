import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Following Details.
 *
 * @typedef {Object} followingSchema
 * @property {String} FL_SourceDtl - Source tag (CD_ or ID_ prefix to identify the entity origin).
 * @property {mongoose.Schema.Types.ObjectId} FL_Id - The entity being followed (company, job seeker, etc.).
 * @property {mongoose.Schema.Types.ObjectId} FL_Following_Individual_Id - The individual who is following.
 * @property {String} FL_Following_Individual_Type - Type of entity being followed: 01 = Company, 02 = Job Seeker, 03 = Institute, 04 = Group.
 * @property {Number} FL_Session_Id - Session identifier for tracking.
 * @property {Date} FL_Creation_DtTym - Timestamp of when the follow action occurred.
 * @property {Array.<AuditTrailSchema>} FL_Audit_Trail - Array of audit trail logs.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const followingSchema = new mongoose.Schema(
  {
    FL_SourceDtl: {
      type: String,
      required: true,
      // Example: "CD_60281" (Company Detail) or "ID_60661" (Individual Detail)
    },
    FL_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Entity being followed (can be from various models)
    },
    FL_Following_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    FL_Following_Individual_Type: {
      type: String,
      enum: ["01", "02", "03", "04"], // 01 - Company, 02 - Job Seeker, 03 - Institute, 04 - Group
      required: true,
    },
    FL_Session_Id: {
      type: Number,
      required: true,
    },
    FL_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    FL_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default mongoose.models.following ||
  mongoose.model("following", followingSchema);

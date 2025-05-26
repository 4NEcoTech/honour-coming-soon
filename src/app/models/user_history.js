import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for User Account History (Deactivation & Deletion Reasons).
 *
 * @typedef {Object} user_historySchema
 * @property {mongoose.Schema.Types.ObjectId} UH_User_Id - Reference to the user (FK to user_table).
 * @property {String} UH_Account_Deactivation_Reason - Deactivation reason code (from fixed list).
 * @property {String} UH_Account_Deletion_Reason - Deletion reason code (from fixed list).
 * @property {String} UH_Deactivation_Other_Reason - Custom reason (if 'Other' is selected for deactivation).
 * @property {String} UH_Delete_Other_Reason - Custom reason (if 'Other' is selected for deletion).
 * @property {Number} UH_Session_Id - Session identifier.
 * @property {Date} UH_Creation_DtTym - Timestamp when the deactivation/deletion was recorded.
 * @property {Array.<AuditTrailSchema>} UH_Audit_Trail - Audit trail entries (action logs).
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const user_historySchema = new mongoose.Schema(
  {
    UH_User_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_table",
      required: true,
    },
    UH_Account_Deactivation_Reason: {
      type: String,
      enum: [
        "01", "02", "03", "04", "05", // Institute Deactivation Reasons
        "06", "07", "08"              // Student Deactivation Reasons
      ],
      default: null,
    },
    UH_Account_Deletion_Reason: {
      type: String,
      enum: [
        "01", "02", "03", "04", "05" // Institute Deletion Reasons only (for now)
      ],
      default: null,
    },
    UH_Deactivation_Other_Reason: {
      type: String,
      default: null,
    },
    UH_Delete_Other_Reason: {
      type: String,
      default: null,
    },
    UH_Session_Id: {
      type: Number,
      required: true,
    },
    UH_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    UH_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export default mongoose.models.user_history ||
  mongoose.model("user_history", user_historySchema);

import mongoose from "mongoose";
import { AuditTrailSchema } from "../common/AuditTrail";

/**
 * Schema for Admin Permissions.
 *
 * @typedef {Object} hcj_permissionsSchema
 * @property {Number} HCJ_Permission_Id - Unique numeric ID for the permission.
 * @property {String} HCJ_Permission_Name - Human-readable permission name (e.g., Add Job, Delete User).
 * @property {String} HCJ_Description - Description of the permission functionality.
 * @property {Number} HCJ_Session_Id - Session tracking identifier.
 * @property {Date} HCJ_Creation_DtTym - Record creation timestamp.
 * @property {Array.<AuditTrailSchema>} HCJ_Audit_Trail - Technical audit trail entries.
 * @property {Date} createdAt - Mongoose-managed creation timestamp.
 * @property {Date} updatedAt - Mongoose-managed update timestamp.
 */

const hcjPermissionsSchema = new mongoose.Schema(
  {
    HCJ_Permission_Id: {
      type: Number,
      required: true,
      unique: true,
    },
    HCJ_Permission_Name: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_Description: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_Session_Id: {
      type: Number,
      required: true,
    },
    HCJ_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.models.hcj_permissions ||
  mongoose.model("hcj_permissions", hcjPermissionsSchema);

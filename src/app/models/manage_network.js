import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Manage Network.
 *
 * @typedef {Object} manage_networkSchema
 * @property {mongoose.Schema.Types.ObjectId} MN_Individual_Id - Reference to the individual whose network is being tracked.
 * @property {Number} MN_Number_Of_Followers - Total number of followers.
 * @property {Number} MN_Number_Of_Following - Total number of entities the individual is following.
 * @property {Number} MN_Number_Of_Connections - Total number of mutual connections.
 * @property {Number} MN_Number_Of_Groups - Total groups the individual is a part of.
 * @property {Number} MN_Number_Of_Pages - Total pages the individual follows or manages.
 * @property {Number} MN_Session_Id - Session identifier for auditing.
 * @property {Date} MN_Creation_DtTym - Timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} MN_Audit_Trail - Array of audit logs.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const manageNetworkSchema = new mongoose.Schema(
  {
    MN_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    MN_Number_Of_Followers: {
      type: Number,
      required: true,
      default: 0,
    },
    MN_Number_Of_Following: {
      type: Number,
      required: true,
      default: 0,
    },
    MN_Number_Of_Connections: {
      type: Number,
      required: true,
      default: 0,
    },
    MN_Number_Of_Groups: {
      type: Number,
      required: true,
      default: 0,
    },
    MN_Number_Of_Pages: {
      type: Number,
      required: true,
      default: 0,
    },
    MN_Session_Id: {
      type: Number,
      required: true,
    },
    MN_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    MN_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Auto-createdAt & updatedAt
  }
);

export default mongoose.models.manage_network ||
  mongoose.model("manage_network", manageNetworkSchema);

import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Individual Connections.
 *
 * @typedef {Object} individual_connectionsSchema
 * @property {mongoose.Schema.Types.ObjectId} IC_Individual_Id - Reference to the individual who initiates the connection.
 * @property {mongoose.Schema.Types.ObjectId} IC_Connected_Id - Reference to the connected entity (individual, company, etc.).
 * @property {String} IC_Connected_Type - Type of connection: "01" = Company, "02" = Job Seeker, "03" = Institute, "04" = Group.
 * @property {Number} IC_Session_Id - Session identifier for tracking the session context.
 * @property {Date} IC_Connected_DtTym - Timestamp when the connection was established.
 * @property {Array.<AuditTrailSchema>} IC_Audit_Trail - Audit trail logs for tracking connection changes/actions.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const individual_connectionsSchema = new mongoose.Schema(
  {
    IC_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    IC_Connected_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Dynamic reference depending on IC_Connected_Type
    },
    IC_Connected_Type: {
      type: String,
      enum: ["01", "02", "03", "04"], // 01 - Company, 02 - Job Seeker, 03 - Institute, 04 - Group
      required: true,
    },
    IC_Session_Id: {
      type: Number,
      required: true,
    },
    IC_Connected_DtTym: {
      type: Date,
      default: Date.now,
    },
    IC_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.models.individual_connections ||
  mongoose.model("individual_connections", individual_connectionsSchema);

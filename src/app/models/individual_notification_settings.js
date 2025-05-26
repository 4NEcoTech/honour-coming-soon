import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Individual Notification Settings.
 *
 * @typedef {Object} individual_notification_settingsSchema
 * @property {mongoose.Schema.Types.ObjectId} INS_Individual_Notification_Id - Reference to the individual (user) these settings belong to.
 * @property {Boolean} INS_Individual_Email_Enable - Enable or disable email notifications.
 * @property {Boolean} INS_Individual_SMS_Enable - Enable or disable SMS notifications.
 * @property {Number} INS_Session_Id - Session identifier for tracking.
 * @property {Date} INS_Creation_DtTym - Timestamp when the settings were created or updated.
 * @property {Array.<AuditTrailSchema>} INS_Audit_Trail - Array of audit trail logs for settings changes.
 * @property {Date} createdAt - Auto-managed timestamp (Mongoose).
 * @property {Date} updatedAt - Auto-managed timestamp (Mongoose).
 */

const individualNotificationSettingsSchema = new mongoose.Schema(
  {
    INS_Individual_Notification_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    INS_Individual_Email_Enable: {
      type: Boolean,
      required: true,
      default: true,
    },
    INS_Individual_SMS_Enable: {
      type: Boolean,
      required: true,
      default: true,
    },
    INS_Session_Id: {
      type: Number,
      required: true,
    },
    INS_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    INS_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.models.individual_notification_settings ||
  mongoose.model("individual_notification_settings", individualNotificationSettingsSchema);

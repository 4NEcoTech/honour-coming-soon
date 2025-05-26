import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Notification Logs.
 *
 * @typedef {Object} notificationSchema
 * @property {mongoose.Schema.Types.ObjectId} NT_Individual_Id - Reference to the user (individual) receiving the notification.
 * @property {String} NT_Notification_Subject - Short subject/title of the notification.
 * @property {String} NT_Notification_Message - Full content/message of the notification.
 * @property {Boolean} NT_Notification_Email_Trigger - Whether an email was sent (true/false).
 * @property {Date} NT_Sent_DtTym - Time when the notification was sent.
 * @property {Date} NT_Received_DtTym - Time when the notification was received by the user.
 * @property {Number} NT_Frequency - (Optional) Frequency in case of recurring alerts.
 * @property {Boolean} NT_Read_Status - Read/unread status (true = read, false = unread).
 * @property {Number} NT_Session_Id - Session identifier.
 * @property {Date} NT_Alert_Created_DtTym - Date and time when the notification was created.
 * @property {Array.<AuditTrailSchema>} NT_Audit_Trail - Audit log history.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const notificationSchema = new mongoose.Schema(
  {
    NT_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    NT_Notification_Subject: {
      type: String,
      required: true,
      trim: true,
    },
    NT_Notification_Message: {
      type: String,
      required: true,
    },
    NT_Notification_Email_Trigger: {
      type: Boolean,
      required: true,
      default: false,
    },
    NT_Sent_DtTym: {
      type: Date,
      required: true,
    },
    NT_Received_DtTym: {
      type: Date,
      required: true,
    },
    NT_Frequency: {
      type: Number,
      default: null,
    },
    NT_Read_Status: {
      type: Boolean,
      required: true,
      default: false,
    },
    NT_Session_Id: {
      type: Number,
      required: true,
    },
    NT_Alert_Created_DtTym: {
      type: Date,
      required: true,
      default: Date.now,
    },
    NT_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

export default mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

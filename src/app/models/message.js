import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Messages exchanged between individuals.
 *
 * @typedef {Object} messageSchema
 * @property {mongoose.Schema.Types.ObjectId} MT_Sender_Id - ID of the individual sending the message.
 * @property {mongoose.Schema.Types.ObjectId} MT_Receiver_Id - ID of the individual receiving the message.
 * @property {String} MT_Msg_Channel - Message channel: 01 = InApp, 02 = Email, 03 = SMS, 04 = Others.
 * @property {String} MT_Message - Message content (must be from a predefined list of allowed messages).
 * @property {Date} MT_Sent_DtTym - Timestamp when the message was sent.
 * @property {Date} MT_Received_DtTym - Timestamp when the message was received.
 * @property {Date} MT_Creation_DtTym - Timestamp when the message record was created.
 * @property {Number} MT_Session_Id - Session identifier for the action context.
 * @property {Array.<AuditTrailSchema>} MT_Audit_Trail - Technical audit log for actions/changes.
 * @property {Date} createdAt - Auto-managed by Mongoose.
 * @property {Date} updatedAt - Auto-managed by Mongoose.
 */

const messageSchema = new mongoose.Schema(
  {
    MT_Sender_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    MT_Receiver_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "individual_details",
      required: true,
    },
    MT_Msg_Channel: {
      type: String,
      enum: ["01", "02", "03", "04"], // 01 = InApp, 02 = Email, 03 = SMS, 04 = Others
      required: true,
    },
    MT_Message: {
      type: String,
      required: true,
      // Ensure content is from a pre-approved list (handled in app logic)
    },
    MT_Sent_DtTym: {
      type: Date,
      required: true,
    },
    MT_Received_DtTym: {
      type: Date,
      required: true,
    },
    MT_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    MT_Session_Id: {
      type: Number,
      required: true,
    },
    MT_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.models.message || mongoose.model("message", messageSchema);

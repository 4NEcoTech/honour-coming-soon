import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Customer Feedback.
 *
 * @typedef {Object} hcjCustomerFeedbackSchema
 * @property {String} HCJ_CFT_Feedback_Id - Unique identifier for the feedback.
 * @property {String} HCJ_CFT_Individual_Id - Unique identifier for the individual providing feedback.
 * @property {String} HCJ_CFT_Feedback - The feedback provided by the customer.
 * @property {Number} HCJ_CFT_Rating - Rating provided by the customer (1-5).
 * @property {Date} HCJ_CFT_Feedback_DtTym - Date and time when the feedback was provided.
 * @property {String} HCJ_CFT_Response - Response to the feedback.
 * @property {Date} HCJ_CFT_Response_DtTym - Date and time when the response was provided.
 * @property {String} HCJ_CFT_Status - Status of the feedback (Pending, Resolved, or Closed).
 * @property {Date} HCJ_CFT_Resolution_DtTym - Date and time when the feedback was resolved.
 * @property {String} HCJ_CFT_Session_Id - Unique identifier for the session.
 * @property {Date} HCJ_CFT_Creation_DtTym - Date and time when the feedback entry was created.
 * @property {Array.<AuditTrailSchema>} HCJ_CFT_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjCustomerFeedbackSchema = new Schema(
  {
//    HCJ_CFT_Feedback_Id: { type: String, required: true, unique: true },
    HCJ_CFT_Individual_Id: { type: String, required: true },
    HCJ_CFT_Feedback: { type: String, required: true },
    HCJ_CFT_Rating: { type: Number, min: 1, max: 5, required: true },
    HCJ_CFT_Feedback_DtTym: { type: Date, default: Date.now },
    HCJ_CFT_Response: { type: String },
    HCJ_CFT_Response_DtTym: { type: Date },
    HCJ_CFT_Status: {
      type: String,
      enum: ['Pending', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    HCJ_CFT_Resolution_DtTym: { type: Date },
    HCJ_CFT_Session_Id: { type: String, required: true },
    HCJ_CFT_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_CFT_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjCustomerFeedback =
  mongoose.models.hcj_customer_feedback ||
  mongoose.model('hcj_customer_feedback', hcjCustomerFeedbackSchema);

export default HcjCustomerFeedback;

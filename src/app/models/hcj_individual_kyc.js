import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Individual KYC.
 *
 * @typedef {Object} hcjIndividualKYCSchema
 * @property {String} HCJ_IK_Individual_Id - Unique identifier for the individual.
 * @property {Boolean} HCJ_IK_Checkbox_Agreement - Indicates if the checkbox agreement was accepted.
 * @property {Boolean} HCJ_IK_Allow_Microphone - Indicates if the microphone is allowed.
 * @property {Boolean} HCJ_IK_Allow_Camera - Indicates if the camera is allowed.
 * @property {String} HCJ_IK_KYC_Status - Status of the KYC process (e.g., Pending, Approved, Rejected).
 * @property {String} HCJ_IK_Session_Id - Identifier for the session during which the KYC was submitted.
 * @property {Date} HCJ_IK_Creation_DtTym - Timestamp when the KYC record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_IK_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjIndividualKYCSchema = new Schema(
  {
    // HCJ_IK_KYC_Id: { type: String, unique: true }, // _id
    HCJ_IK_Individual_Id: { type: String, required: true },
    HCJ_IK_Checkbox_Agreement: { type: Boolean, default: false },
    HCJ_IK_Allow_Microphone: { type: Boolean, default: false },
    HCJ_IK_Allow_Camera: { type: Boolean, default: false },
    HCJ_IK_KYC_Status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    HCJ_IK_Session_Id: { type: String },
    HCJ_IK_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_IK_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjIndividualKYC =
  mongoose.models.HcjIndividualKYC ||
  mongoose.model('hcj_individual_kyc', hcjIndividualKYCSchema);

export default HcjIndividualKYC;

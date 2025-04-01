import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for Returning from Illness individuals in the HCJ application.
 *
 * @typedef {Object} hcjReturningFromIllnessSchema
 * @property {String} HCJ_RFI_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_RFI_Illness_Description - The description of the illness.
 * @property {String} HCJ_RFI_Fitness_Certificate - The fitness certificate document.
 * @property {String} HCJ_RFI_Session_Id - The session ID.
 * @property {Date} HCJ_RFI_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_RFI_Audit_Trail - The audit trail for the schema.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjReturningFromIllnessSchema = new Schema(
  {
  //  HCJ_RFI_Job_Seeker_Id: { type: String },
    HCJ_RFI_Illness_Description: { type: String },
    HCJ_RFI_Fitness_Certificate: { type: String },
    HCJ_RFI_Session_Id: { type: String },
    HCJ_RFI_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_RFI_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjReturningFromIllness =
  mongoose.models.HcjReturningFromIllness ||
  mongoose.model('HcjReturningFromIllness', hcjReturningFromIllnessSchema);

export default HcjReturningFromIllness;
import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for Differently Abled individuals in the HCJ application.
 *
 * @typedef {Object} hcjDiffrentlyAbledSchema
 * @property {String} HCJ_DA_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_DA_Disability_Type - The type of disability.
 * @property {Number} HCJ_DA_Disability_Percentage - The percentage of disability.
 * @property {String} HCJ_DA_Disability_Id - The ID of the disability.
 * @property {String} HCJ_DA_Disability_Document - The document related to the disability.
 * @property {String} HCJ_DA_Accessibility_Needs - The accessibility needs of the individual.
 * @property {String} HCJ_DA_Session_Id - The session ID.
 * @property {Date} HCJ_DA_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_DA_Audit_Trail - The audit trail for the schema.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjDiffrentlyAbledSchema = new Schema(
  {
//    HCJ_DA_Job_Seeker_Id: { type: String },
    HCJ_DA_Disability_Type: { type: String },
    HCJ_DA_Disability_Percentage: { type: Number },
    HCJ_DA_Disability_Id: { type: String },
    HCJ_DA_Disability_Document: { type: String },
    HCJ_DA_Accessibility_Needs: { type: String },
    HCJ_DA_Session_Id: { type: String },
    HCJ_DA_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_DA_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjDiffrentlyAbled =
  mongoose.models.HcjDiffrentlyAbled ||
  mongoose.model('HcjDiffrentlyAbled', hcjDiffrentlyAbledSchema);

export default HcjDiffrentlyAbled;
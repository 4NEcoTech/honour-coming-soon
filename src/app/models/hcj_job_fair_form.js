import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Job Fair Form.
 *
 * @typedef {Object} hcjJobFairFormSchema
 * @property {String} HCJ_JFF_Institution_Name - Name of the institution.
 * @property {String} HCJ_JFF_Institution_Address - Address of the institution.
 * @property {String} HCJ_JFF_Institution_Email - Email of the institution.
 * @property {String} HCJ_JFF_Institution_Phone - Phone number of the institution.
 * @property {String} HCJ_JFF_Institution_Admin_Phone - Phone number of the institution admin.
 * @property {String} HCJ_JFF_First_Name - First name of the user.
 * @property {String} HCJ_JFF_Last_Name - Last name of the user.
 * @property {String} HCJ_JFF_Email - Email of the user.
 * @property {String} HCJ_JFF_User_Phone - Phone number of the user.
 * @property {String} HCJ_JFF_Session_Id - Session ID.
 * @property {Date} HCJ_JFF_Creation_DtTym - Creation date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_JFF_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjJobFairFormSchema = new Schema(
  {
    HCJ_JFF_Institution_Name: { type: String, required: true },
    HCJ_JFF_Institution_Address: { type: String, required: true },
    HCJ_JFF_Institution_Email: { type: String },
    HCJ_JFF_Institution_Phone: { type: String },
    HCJ_JFF_Institution_Admin_Phone: { type: String },
    HCJ_JFF_First_Name: { type: String, required: true },
    HCJ_JFF_Last_Name: { type: String },
    HCJ_JFF_Email: { type: String, required: true },
    HCJ_JFF_User_Phone: { type: String, required: true },
    HCJ_JFF_Session_Id: { type: String, required: false },
    HCJ_JFF_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JFF_Audit_Trail: [AuditTrailSchema],
  },

  {
    timestamps: true,
  }
);

const HcjJobFairForm =
  mongoose.models.Jobfairform ||
  mongoose.model('hcj_job_fair_form', hcjJobFairFormSchema);

export default HcjJobFairForm;

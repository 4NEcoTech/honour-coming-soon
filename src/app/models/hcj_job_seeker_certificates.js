import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Job Seeker Certificates.
 *
 * @typedef {Object} hcjJobSeekerCertificatesSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JC_Certificate_Id - The ID of the certificate.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JC_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_JC_Certificate_Name - The name of the certificate.
 * @property {String} HCJ_JC_Issuing_Org - The organization that issued the certificate.
 * @property {Date} HCJ_JC_Issue_Date - The date the certificate was issued.
 * @property {Date} HCJ_JC_Expiry_Date - The date the certificate expires.
 * @property {String} HCJ_JC_Certificate_Url - The URL of the certificate.
 * @property {Buffer} HCJ_JC_Certificate_Upload - The uploaded certificate document.
 * @property {String} HCJ_JC_Session_Id - The session ID.
 * @property {Date} HCJ_JC_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_JC_Audit_Trail - An array of audit trail records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjJobSeekerCertificatesSchema = new Schema(
  {
    HCJ_JC_Certificate_Id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    HCJ_JC_Job_Seeker_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'hcj_job_seeker', required: true },
    HCJ_JC_Certificate_Name: { type: String, required: true },
    HCJ_JC_Issuing_Org: { type: String, required: true },
    HCJ_JC_Issue_Date: { type: Date, required: true },
    HCJ_JC_Expiry_Date: { type: Date },
    HCJ_JC_Certificate_Url: { type: String },
    HCJ_JC_Certificate_Upload: { type: Buffer },
    HCJ_JC_Session_Id: { type: String, required: true },
    HCJ_JC_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JC_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJobSeekerCertificates =
  mongoose.models.HcjJobSeekerCertificates ||
  mongoose.model('HcjJobSeekerCertificates', hcjJobSeekerCertificatesSchema);

export default HcjJobSeekerCertificates;

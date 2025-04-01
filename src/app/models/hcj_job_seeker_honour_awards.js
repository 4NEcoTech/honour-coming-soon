import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Job Seeker Honour Awards.
 *
 * @typedef {Object} hcjJobSeekerHonourAwardsSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSHA_Award_Id - The ID of the award.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSHA_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_JSHA_Position - The position achieved.
 * @property {String} HCJ_JSHA_Award_Name - The name of the award.
 * @property {Date} HCJ_JSHA_Award_Date - The date the award was received.
 * @property {String} HCJ_JSHA_Award_Url - The URL associated with the award.
 * @property {Buffer} HCJ_JSHA_Award_Upload - The uploaded award document or image.
 * @property {Number} HCJ_JSA_Updated_By - The ID of the user who last updated the record.
 * @property {String} HCJ_JSA_Session_Id - The session ID.
 * @property {Date} HCJ_JSA_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_JSA_Audit_Trail - An array of audit trail records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjJobSeekerHonourAwardsSchema = new Schema(
  {
  //  HCJ_JSHA_Award_Id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    HCJ_JSHA_Job_Seeker_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'hcj_job_seeker', required: true },
    HCJ_JSHA_Position: { type: String },
    HCJ_JSHA_Award_Name: { type: String, required: true },
    HCJ_JSHA_Award_Date: { type: Date, required: true },
    HCJ_JSHA_Award_Url: { type: String },
    HCJ_JSHA_Award_Upload: { type: Buffer },
    HCJ_JSA_Updated_By: { type: Number },
    HCJ_JSA_Session_Id: { type: String, required: true },
    HCJ_JSA_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JSA_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJobSeekerHonourAwards =
  mongoose.models.HcjJobSeekerHonourAwards ||
  mongoose.model('HcjJobSeekerHonourAwards', hcjJobSeekerHonourAwardsSchema);

export default HcjJobSeekerHonourAwards;

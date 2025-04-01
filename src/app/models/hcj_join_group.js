import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for joining a group in the HCJ application.
 *
 * @typedef {Object} hcjJoinGroupSchema
 * @property {String} HCJ_GJ_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_GJ_Company_Id - The ID of the company.
 * @property {String} HCJ_GJ_Question_1 - The first question.
 * @property {String} HCJ_GJ_Question_2 - The second question.
 * @property {String} HCJ_GJ_Question_3 - The third question.
 * @property {String} HCJ_GJ_Email_Address - The email address.
 * @property {String} HCJ_GJ_Phone - The phone number.
 * @property {String} HCJ_GJ_Session_Id - The session ID.
 * @property {Date} HCJ_GJ_Group_Joined_DtTym - The date and time the group was joined.
 * @property {Array.<AuditTrailSchema>} HCJ_GJ_Audit_Trail - The audit trail for the schema.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjJoinGroupSchema = new Schema(
  {
  //  HCJ_GJ_Job_Seeker_Id: { type: String },
    HCJ_GJ_Company_Id: { type: String },
    HCJ_GJ_Question_1: { type: String },
    HCJ_GJ_Question_2: { type: String },
    HCJ_GJ_Question_3: { type: String },
    HCJ_GJ_Email_Address: { type: String },
    HCJ_GJ_Phone: { type: String },
    HCJ_GJ_Session_Id: { type: String },
    HCJ_GJ_Group_Joined_DtTym: { type: Date, default: Date.now },
    HCJ_GJ_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJoinGroup =
  mongoose.models.HcjJoinGroup ||
  mongoose.model('HcjJoinGroup', hcjJoinGroupSchema);

export default HcjJoinGroup;

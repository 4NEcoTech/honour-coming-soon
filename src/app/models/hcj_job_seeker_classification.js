import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Job Seeker Classification.
 *
 * @typedef {Object} hcjJobSeekerClassificationSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSC_Job_Seeker_Id - The ID of the job seeker.
 * @property {Boolean} HCJ_JSC_Need_Flexibility - Indicates if the job seeker needs flexibility.
 * @property {Boolean} HCJ_JSC_Mother - Indicates if the job seeker is a mother.
 * @property {Boolean} HCJ_JSC_Gender - Indicates the gender of the job seeker.
 * @property {Boolean} HCJ_JSC_Diffrently_Abled - Indicates if the job seeker is differently abled.
 * @property {Boolean} HCJ_JSC_Single_Parent - Indicates if the job seeker is a single parent.
 * @property {Boolean} HCJ_JSC_Returning_From_Illness - Indicates if the job seeker is returning from an illness.
 * @property {Boolean} HCJ_JSC_Veterans - Indicates if the job seeker is a veteran.
 * @property {Boolean} HCJ_JSC_Racial_Biased - Indicates if the job seeker faces racial bias.
 * @property {Boolean} HCJ_JSC_LGBTQIA - Indicates if the job seeker identifies as LGBTQIA.
 * @property {Boolean} HCJ_JSC_Seniors - Indicates if the job seeker is a senior.
 * @property {Boolean} HCJ_JSC_Student - Indicates if the job seeker is a student.
 * @property {Boolean} HCJ_JSC_Sports_Person - Indicates if the job seeker is a sports person.
 * @property {String} HCJ_JSC_Session_Id - The session ID.
 * @property {Date} HCJ_JSC_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_JSC_Audit_Trail - An array of audit trail records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjJobSeekerClassificationSchema = new Schema(
  {
    HCJ_JSC_Job_Seeker_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'hcj_job_seeker', required: true },
    HCJ_JSC_Need_Flexibility: { type: Boolean },
    HCJ_JSC_Mother: { type: Boolean },
    HCJ_JSC_Gender: { type: Boolean, required: true },
    HCJ_JSC_Diffrently_Abled: { type: Boolean, required: true },
    HCJ_JSC_Single_Parent: { type: Boolean, required: true },
    HCJ_JSC_Returning_From_Illness: { type: Boolean, required: true },
    HCJ_JSC_Veterans: { type: Boolean, required: true },
    HCJ_JSC_Racial_Biased: { type: Boolean },
    HCJ_JSC_LGBTQIA: { type: Boolean },
    HCJ_JSC_Seniors: { type: Boolean, required: true },
    HCJ_JSC_Student: { type: Boolean, required: true },
    HCJ_JSC_Sports_Person: { type: Boolean, required: true },
    HCJ_JSC_Session_Id: { type: String, required: true },
    HCJ_JSC_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JSC_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
    collection: 'hcj_job_seeker_classification',
  }
);

const HcjJobSeekerClassification =
  mongoose.models.HcjJobSeekerClassification ||
  mongoose.model('HcjJobSeekerClassification', hcjJobSeekerClassificationSchema);

export default HcjJobSeekerClassification;

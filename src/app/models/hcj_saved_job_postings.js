import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for saved job postings in the HCJ application.
 *
 * @typedef {Object} hcjSavedJobPostingsSchema
 * @property {String} HCJ_SJP_Saved_Id - Unique ID of the saved job posting.
 * @property {Schema.Types.ObjectId} HCJ_SJP_Company_Id - The ID of the company associated with the job posting. References the 'company_details' collection.
 * @property {Schema.Types.ObjectId} HCJ_SJP_Job_Id - The ID of the job posting. References the 'hcj_job_postings' collection.
 * @property {Schema.Types.ObjectId} HCJ_SJP_Job_Seeker_Id - The ID of the job seeker who saved the job posting. References the 'hcj_job_seeker' collection.
 * @property {Date} HCJ_SJP_Saved_DtTym - The date and time when the job was saved.
 * @property {String} HCJ_SJP_Session_Id - The session ID associated with the saved job posting.
 * @property {Array.<AuditTrailSchema>} HCJ_SJP_Audit_Trail - An array of audit trail entries for the saved job posting.
 * @property {Date} createdAt - The timestamp when the document was created. Automatically managed by Mongoose.
 * @property {Date} updatedAt - The timestamp when the document was last updated. Automatically managed by Mongoose.
 */

const hcjSavedJobPostingsSchema = new Schema(
  {
  //  HCJ_SJP_Saved_Id: { type: String,  },
    HCJ_SJP_Company_Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'company_details',
    },
    HCJ_SJP_Job_Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'hcj_job_postings',
    },
    HCJ_SJP_Job_Seeker_Id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'hcj_job_seeker',
    },
    HCJ_SJP_Saved_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_SJP_Session_Id: {
      type: String,
      required: true,
    },
    HCJ_SJP_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjSavedJobPostings =
  mongoose.models.hcj_saved_job_postings ||
  mongoose.model('hcj_saved_job_postings', hcjSavedJobPostingsSchema);

export default HcjSavedJobPostings;

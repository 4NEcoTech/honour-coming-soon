import mongoose from 'mongoose';
import { AuditTrailSchema } from '@/app/models/common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Job Seeker Volunteer Activity.
 *
 * @typedef {Object} hcjJobSeekerVolunteerActivitySchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSV_VolunteerActivity_Id - The ID of the volunteer activity.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSV_Job_Seeker_Id - The ID of the job seeker.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSV_Individual_Id - The ID of the individual.
 * @property {String} HCJ_JSV_VolunteerActivity_Name - The name of the volunteer activity.
 * @property {String} HCJ_JSV_Company_Name - The name of the company or organization.
 * @property {Date} HCJ_JSV_Start_Date - The start date of the volunteer activity.
 * @property {Date} HCJ_JSV_End_Date - The end date of the volunteer activity.
 * @property {String} HCJ_JSV_VolunteerActivity_Status - The status of the volunteer activity (e.g., Ongoing, Completed).
 * @property {String} HCJ_JSV_VolunteerActivity_Description - A description of the volunteer activity.
 * @property {String} HCJ_JSV_Session_Id - The session ID.
 * @property {Date} HCJ_JSV_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {Array.<AuditTrailSchema>} HCJ_JSV_Audit_Trail - An array of audit trail records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjJobSeekerVolunteerActivitySchema = new Schema(
  {
    // HCJ_JSV_VolunteerActivity_Id
    HCJ_JSV_Job_Seeker_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'JobSeeker' },
    HCJ_JSV_Individual_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Individual' },
    HCJ_JSV_VolunteerActivity_Name: { type: String, required: true },
    HCJ_JSV_Company_Name: { type: String, required: true },
    HCJ_JSV_Start_Date: { type: Date, required: true },
    HCJ_JSV_End_Date: { type: Date, default: null },
    HCJ_JSV_VolunteerActivity_Status: { type: String, required: true, enum: ['01', '02', '03'] },
    HCJ_JSV_VolunteerActivity_Description: { type: String },
    HCJ_JSV_Session_Id: { type: String, required: false },
    HCJ_JSV_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JSV_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJobSeekerVolunteerActivity =
  mongoose.models["hcj_jobseeker_volunteer_activity"] ||
  mongoose.model("hcj_jobseeker_volunteer_activity", hcjJobSeekerVolunteerActivitySchema);

export default HcjJobSeekerVolunteerActivity;

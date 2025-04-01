import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema for HCJ Virtual Job Fair.
 *
 * @typedef {Object} HcjVirtualJobFairSchema
 * @property {String} HCJ_VJF_Job_Fair_Id - Unique identifier for the job fair.
 * @property {Number} HCJ_VJF_Job_FairNum - Job fair number.
 * @property {String} HCJ_VJF_Company_Id - Identifier for the company hosting the job fair.
 * @property {String} HCJ_VJF_Job_Fair_Title - Title of the job fair.
 * @property {String} HCJ_VJF_Description - Description of the job fair.
 * @property {String} HCJ_VJF_Job_Industry - Industry of the job fair.
 * @property {String} HCJ_VJF_Job_Title - Title of the job being offered.
 * @property {String[]} HCJ_VJF_Required_Skills - List of required skills for the job.
 * @property {Number} HCJ_VJF_Number_Of_Vacancy - Number of vacancies available.
 * @property {Date} HCJ_VJF_Registration_Deadline - Deadline for registration.
 * @property {Number} HCJ_VJF_Registration_Limit - Limit on the number of registrations.
 * @property {String} HCJ_VJF_Job_Fair_Mode - Mode of the job fair (e.g., virtual, in-person).
 * @property {String} HCJ_VJF_Job_Fair_Location - Location of the job fair.
 * @property {String} HCJ_VJF_Job_Fair_Intractive_Map - Interactive map for the job fair.
 * @property {Date} HCJ_VJF_Start_Date - Start date of the job fair.
 * @property {Date} HCJ_VJF_End_Date - End date of the job fair.
 * @property {String} HCJ_VJF_Session_Id - Session identifier for the job fair.
 * @property {Date} HCJ_VJF_Creation_DtTym - Creation date and time of the job fair record.
 * @property {String} HCJ_VJF_Audit_Trail - Audit trail information.
 */

const hcjVirtualJobFairSchema = new Schema(
  {
  //  HCJ_VJF_Job_Fair_Id: { type: String },
    HCJ_VJF_Job_FairNum: { type: Number },
    HCJ_VJF_Company_Id: { type: String },
    HCJ_VJF_Job_Fair_Title: { type: String },
    HCJ_VJF_Description: { type: String },
    HCJ_VJF_Job_Industry: { type: String },
    HCJ_VJF_Job_Title: { type: String },
    HCJ_VJF_Required_Skills: { type: [String] },
    HCJ_VJF_Number_Of_Vacancy: { type: Number },
    HCJ_VJF_Registration_Deadline: { type: Date },
    HCJ_VJF_Registration_Limit: { type: Number },
    HCJ_VJF_Job_Fair_Mode: { type: String },
    HCJ_VJF_Job_Fair_Location: { type: String },
    HCJ_VJF_Job_Fair_Intractive_Map: { type: String },
    HCJ_VJF_Start_Date: { type: Date },
    HCJ_VJF_End_Date: { type: Date },
    HCJ_VJF_Session_Id: { type: String },
    HCJ_VJF_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_VJF_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hcj_virtual_job_fair', hcjVirtualJobFairSchema);

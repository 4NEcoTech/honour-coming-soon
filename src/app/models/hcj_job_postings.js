import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Job Postings.
 *
 * @typedef {Object} hcjJobPostingsSchema
 * @property {String} HCJ_JP_Job_Id - The job ID.
 * @property {String} HCJ_JP_Company_Id - The company ID.
 * @property {String} HCJ_JP_Job_Num - The job number.
 * @property {String} HCJ_JP_Opportunity_Type - The type of job opportunity.
 * @property {String} HCJ_JP_Job_Headline - The headline for the job posting.
 * @property {String} HCJ_JP_Job_Title - The job title.
 * @property {String} HCJ_JP_Project_Name - The name of the project.
 * @property {String} HCJ_Project_Duration - The duration of the project.
 * @property {String} HCJ_JP_Job_Description - The job description.
 * @property {String} HCJ_JP_About_Internship - Information about the internship.
 * @property {Number} HCJ_JP_Application_Limit - Maximum number of applications allowed.
 * @property {Number} HCJ_JP_Interns_Required - Number of interns required.
 * @property {Boolean} HCJ_JP_Long_Term_Indicator - Indicates if the job is long-term.
 * @property {String} HCJ_JP_Job_Type - Type of job (e.g., full-time, part-time).
 * @property {String} HCJ_JP_Job_Duration - Duration of the job.
 * @property {Boolean} HCJ_JP_Start_Date_Flag - Indicates if the start date is fixed.
 * @property {String} HCJ_JP_Responsibility - Responsibilities of the job.
 * @property {String} HCJ_JP_Additional_Preferences - Additional preferences for candidates.
 * @property {String[]} HCJ_JP_Assessment_Questions - List of assessment questions.
 * @property {Boolean} HCJ_JP_Salary_Flag - Indicates if the job offers a salary.
 * @property {String} HCJ_JP_Salary_Currency - Currency of the salary.
 * @property {Number} HCJ_JP_Salary_Amount - Amount of the salary.
 * @property {String} HCJ_JP_Salary_Period - Salary payment period (e.g., monthly, yearly).
 * @property {String} HCJ_JP_Probation_Period - Duration of the probation period.
 * @property {String[]} HCJ_JP_Perks - List of job perks.
 * @property {Boolean} HCJ_JP_Equal_Opportunity_Flag - Indicates if the job promotes equal opportunity.
 * @property {String} HCJ_JP_Who_Can_Apply - Eligibility criteria for applicants.
 * @property {String} HCJ_JP_Additional_Requirement - Additional requirements for the job.
 * @property {Date} HCJ_JP_Closing_Date - Closing date for applications.
 * @property {String} HCJ_JP_Internship_Duration - Duration of the internship.
 * @property {String} HCJ_JP_Graduation_Status - Graduation status required.
 * @property {String[]} HCJ_JP_Job_Skills - Array of required job skills.
 * @property {String} HCJ_JDT_Job_Location - Location of the job.
 * @property {Number} HCJ_JDT_Salary - Salary offered.
 * @property {Date} HCJ_JDT_Posted_DtTym - Date and time when the job was posted.
 * @property {Date} HCJ_JDT_Application_Deadline - Deadline for submitting applications.
 * @property {Date} HCJ_JDT_Applied_DtTym - Date and time when the applicant applied.
 * @property {String} HCJ_JDT_Job_Status - Status of the job posting.
 * @property {String} HCJ_JDT_Session_Id - Session ID associated with the job.
 * @property {Date} HCJ_JDT_Creation_DtTym - Timestamp when the job posting was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JDT_Audit_Trail - Array of audit trail entries.
 * @property {Date} createdAt - Timestamp indicating when the document was created.
 * @property {Date} updatedAt - Timestamp indicating when the document was last updated.
 */

const hcjJobPostingsSchema = new Schema(
  {
  //  HCJ_JP_Job_Id: { type: String },
    HCJ_JP_Company_Id: { type: String },
    HCJ_JP_Job_Num: { type: String },
    HCJ_JP_Opportunity_Type: { type: String },
    HCJ_JP_Job_Headline: { type: String },
    HCJ_JP_Job_Title: { type: String },
    HCJ_JP_Project_Name: { type: String },
    HCJ_Project_Duration: { type: String },
    HCJ_JP_Job_Description: { type: String },
    HCJ_JP_About_Internship: { type: String },
    HCJ_JP_Application_Limit: { type: Number },
    HCJ_JP_Interns_Required: { type: Number },
    HCJ_JP_Long_Term_Indicator: { type: Boolean },
    HCJ_JP_Job_Type: { type: String },
    HCJ_JP_Job_Duration: { type: String },
    HCJ_JP_Start_Date_Flag: { type: Boolean },
    HCJ_JP_Responsibility: { type: String },
    HCJ_JP_Additional_Preferences: { type: String },
    HCJ_JP_Assessment_Questions: { type: [String] },
    HCJ_JP_Salary_Flag: { type: Boolean },
    HCJ_JP_Salary_Currency: { type: String },
    HCJ_JP_Salary_Amount: { type: Number },
    HCJ_JP_Salary_Period: { type: String },
    HCJ_JP_Probation_Period: { type: String },
    HCJ_JP_Perks: { type: [String] },
    HCJ_JP_Equal_Opportunity_Flag: { type: Boolean },
    HCJ_JP_Who_Can_Apply: { type: String },
    HCJ_JP_Additional_Requirement: { type: String },
    HCJ_JP_Closing_Date: { type: Date },
    HCJ_JP_Internship_Duration: { type: String },
    HCJ_JP_Graduation_Status: { type: String },
    HCJ_JP_Job_Skills: { type: [String] }, // ✅ Array of strings for job skills
    HCJ_JDT_Job_Location: { type: String },
    HCJ_JDT_Salary: { type: Number },
    HCJ_JDT_Posted_DtTym: { type: Date, default: Date.now },
    HCJ_JDT_Application_Deadline: { type: Date },
    HCJ_JDT_Applied_DtTym: { type: Date },
    HCJ_JDT_Job_Status: { type: String },
    HCJ_JDT_Session_Id: { type: String },
    HCJ_JDT_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JDT_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjJobPostings =
  mongoose.models.hcj_job_postings ||
  mongoose.model('hcj_job_postings', hcjJobPostingsSchema);

export default HcjJobPostings;

import mongoose from 'mongoose';
import { z } from 'zod';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * Schema definition for HCJ Job Seeker Experience.
 *
 * @typedef {Object} hcjJobSeekerExperienceSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSX_Experience_Id - Unique identifier for the experience record (MongoDB ObjectId).
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSX_Job_Seeker_Id - Reference to the Job Seeker (Foreign Key).
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSX_Individual_Id - Reference to the Individual (Foreign Key).
 * @property {String} HCJ_JSX_Company_Name - The name of the company where the individual worked.
 * @property {Date} HCJ_JSX_Start_Date - The start date of the employment.
 * @property {Date} HCJ_JSX_End_Date - The end date of the employment (nullable if currently working).
 * @property {Boolean} HCJ_JSX_Currently_Working - Indicates whether the individual is currently working in this job.
 * @property {String} HCJ_JSX_Job_Description - Description of the job role and responsibilities.
 * @property {String} HCJ_JSX_Job_Title - The job title or designation.
 * @property {String} HCJ_JSX_Country - The country where the job was located.
 * @property {String} HCJ_JSX_State - The state or region where the job was located.
 * @property {String} HCJ_JSX_City - The city where the job was located.
 * @property {String} HCJ_JSX_Work_Mode - The mode of work (e.g., Remote, Hybrid, On-site).
 * @property {String} HCJ_JSX_Employement_Type - Type of employment (e.g., Full-time, Part-time, Contract).
 * @property {String} HCJ_JSX_Project_Name - Name of the project the job seeker worked on (if applicable).
 * @property {String} HCJ_JSX_Volunteering_Activity - Details of any volunteering activities during employment.
 * @property {String} HCJ_JSX_About_Project - Additional information about the project.
 * @property {String} HCJ_JSX_Updated_By - Identifier of the user who last updated the record.
 * @property {String} HCJ_JSX_Session_Id - Identifier for the session in which the experience was recorded.
 * @property {Date} HCJ_JSX_Creation_DtTym - Timestamp when the experience entry was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JSX_Audit_Trail - An array of audit trail records for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */


// Define Zod schema for validation


//  Define the Zod schema properly
const experienceSchemaZod = z.object({
  HCJ_JSX_Job_Seeker_Id: z.string().min(1, "Job Seeker ID is required"),
  HCJ_JSX_Individual_Id: z.string().min(1, "Individual ID is required"),
  HCJ_JSX_Company_Name: z.string().min(1, "Company Name is required"),
  HCJ_JSX_Start_Date: z.string().min(1, "Start Date is required"),
  HCJ_JSX_End_Date: z.string().optional(),
  HCJ_JSX_Currently_Working: z.boolean(),
  HCJ_JSX_Job_Description: z.string().optional(),
  HCJ_JSX_Job_Title: z.string().min(1, "Job Title is required"),
  HCJ_JSX_Country: z.string().min(1, "Country is required"),
  HCJ_JSX_City: z.string().min(1, "City is required"),
  HCJ_JSX_Work_Mode: z.string().min(1, "Work Mode is required"),
  HCJ_JSX_Employement_Type: z.string().min(1, "Employment Type is required"),
  HCJ_JSX_Updated_By: z.string().min(1, "Updated By is required"),
}).partial(); 


// Mongoose schema for Experience
const experienceSchemaMongo = new mongoose.Schema(
  {
    HCJ_JSX_Job_Seeker_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'JobSeeker' },
    HCJ_JSX_Individual_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Individual' },
    HCJ_JSX_Company_Name: { type: String, required: true },
    HCJ_JSX_Job_Title: { type: String, required: true },
    HCJ_JSX_Start_Date: { type: Date, required: true },
    HCJ_JSX_End_Date: { type: Date, default: null },
    HCJ_JSX_Currently_Working: { type: Boolean, required: true },
    HCJ_JSX_Job_Description: { type: String, required: true },
    HCJ_JSX_Country: { type: String, required: true },
    HCJ_JSX_State: { type: String, required: false },
    HCJ_JSX_City: { type: String, required: true },
    HCJ_JSX_Work_Mode: { type: String, required: true },
    HCJ_JSX_Employement_Type: { type: String, required: true },
    HCJ_JSX_Project_Name: { type: String, required: false },
    HCJ_JSX_Volunteering_Activity: { type: String, required: false },
    HCJ_JSX_About_Project: { type: String, required: false },
    HCJ_JSX_Updated_By: { type: String, required: true },
    HCJ_JSX_Session_Id: { type: String, required: false },
    HCJ_JSX_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JSX_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Mongoose model
const Experience =
  mongoose.models.hcj_job_seeker_experience ||
  mongoose.model('hcj_job_seeker_experience', experienceSchemaMongo);

// Export Zod schema and Mongoose model
export { Experience, experienceSchemaZod };




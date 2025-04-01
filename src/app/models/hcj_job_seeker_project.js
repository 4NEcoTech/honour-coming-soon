import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema definition for HCJ_JOB_SEEKER_PROJECTS.
 *
 * @typedef {Object} hcjJobSeekerProjectsSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSP_Project_Id - The unique identifier for the project (Auto-generated).
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSP_Job_Seeker_Id - The ID of the job seeker.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSP_Individual_Id - The ID of the individual.
 * @property {String} HCJ_JSP_Project_Name - The name of the project.
 * @property {String} HCJ_JSP_Company_Name - The name of the company.
 * @property {Date} HCJ_JSP_Start_Date - The start date of the project.
 * @property {Date} HCJ_JSP_End_Date - The end date of the project.
 * @property {String} HCJ_JSP_Project_Status - The status of the project (e.g., Ongoing, Completed).
 * @property {String} HCJ_JSP_Project_Description - The description of the project.
 * @property {String} HCJ_JSP_Session_Id - The session ID.
 * @property {Date} HCJ_JSP_Creation_DtTym - The creation date and time, defaults to the current date and time.
 * @property {AuditTrailSchema[]} HCJ_JSP_Audit_Trail - An array of audit trail records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */
const hcjJobSeekerProjectsSchema = new mongoose.Schema(
  {
  //  HCJ_JSP_Project_Id: { type: mongoose.Schema.Types.ObjectId, auto: true, },
    HCJ_JSP_Job_Seeker_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "HcjJobSeeker",
    },
    HCJ_JSP_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "IndividualDetails",
    },
    HCJ_JSP_Project_Name: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JSP_Company_Name: {
      type: String,
      required: true,
      trim: true,
    },
    HCJ_JSP_Start_Date: {
      type: Date,
      required: true,
    },
    HCJ_JSP_End_Date: {
      type: Date,
      required: false,
    },
    HCJ_JSP_Project_Status: {
      type: String,
      required: true,
      enum: ["01", "02", "03"],
      default: "02",
    },
    HCJ_JSP_Project_Description: {
      type: String,
      required: false,
      trim: true,
    },
    HCJ_JSP_Session_Id: {
      type: String,
      required: false,
    },
    HCJ_JSP_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_JSP_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure schema is not recompiled
export default mongoose.models.HCJ_JOB_SEEKER_PROJECTS ||
  mongoose.model("HCJ_JOB_SEEKER_PROJECTS", hcjJobSeekerProjectsSchema);

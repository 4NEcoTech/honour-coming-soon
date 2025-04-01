// import mongoose from "mongoose";
// import { AuditTrailSchema } from "./common/AuditTrail";

// /**
//  * @typedef {Object} HCJJobSeekerLanguagesSchema
//  * @property {mongoose.Schema.Types.ObjectId} HCJ_JSL_Language_Id - Auto-generated unique identifier for the language entry.
//  * @property {String} HCJ_JSL_Job_Seeker_Id - The ID of the job seeker.
//  * @property {Array.<Object>} HCJ_JSL_Languages - Array of languages known by the job seeker.
//  * @property {String} HCJ_JSL_Languages[].HCJ_JSL_Language - The name of the language.
//  * @property {Number} HCJ_JSL_Languages[].HCJ_JSL_Language_Proficiency_Level - Proficiency level of the language (1: Beginner, 5: Expert).
//  * @property {String} HCJ_JSL_Languages[].HCJ_JSL_Language_Proficiency - Proficiency category (Basic, Intermediate, Advanced).
//  * @property {String} HCJ_JSL_Session_Id - Session ID to track language updates.
//  * @property {Date} HCJ_JSL_Creation_DtTym - Timestamp when the language entry was created.
//  * @property {Array.<AuditTrailSchema>} HCJ_JSL_Audit_Trail - Array of audit trail entries.
//  * @property {Date} createdAt - Timestamp indicating when the document was created.
//  * @property {Date} updatedAt - Timestamp indicating when the document was last updated.
//  */

// // Language Sub-Schema (Inside Array)
// const LanguageSchema = new mongoose.Schema(
//   {
//     HCJ_JSL_Language: { type: String, required: true }, // Required Language Name
//     HCJ_JSL_Language_Proficiency_Level: {
//       type: Number,
//       enum: [1, 2, 3, 4, 5], // Proficiency Level: 1 (Beginner) - 5 (Expert)
//       required: true,
//     },
//     HCJ_JSL_Language_Proficiency: {
//       type: String,
//       enum: ["Basic", "Intermediate", "Advanced"], // Text-based Proficiency
//       required: true,
//     },
//   },
//   { _id: false } // No separate ID for each language entry
// );

// // Main Schema (Single Document for Each Job Seeker)
// const HCJJobSeekerLanguagesSchema = new mongoose.Schema(
//   {
//     HCJ_JSL_Job_Seeker_Id: { type: String, required: true }, // Required Job Seeker ID
//     HCJ_JSL_Languages: { type: [LanguageSchema], default: [] }, // Array of Languages
//     HCJ_JSL_Session_Id: { type: String, required: false }, // Optional Session ID
//     HCJ_JSL_Creation_DtTym: { type: Date, default: Date.now }, // Auto-set Creation Date
//     HCJ_JSL_Audit_Trail: [AuditTrailSchema], // Audit Trail
//   },
//   {
//     timestamps: true,
//   }
// );

// // Export the model
// export default mongoose.models.hcj_job_seeker_languages ||
//   mongoose.model("hcj_job_seeker_languages", HCJJobSeekerLanguagesSchema);

import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * @typedef {Object} HCJJobSeekerLanguagesSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_JSL_Language_Id - Unique identifier for the language entry.
 * @property {String} HCJ_JSL_Source - Source of language proficiency data.
 * @property {String} HCJ_JSL_Id - Unique system-generated identifier.
 * @property {String} HCJ_JSL_Language - The name of the language.
 * @property {Number} HCJ_JSL_Language_Proficiency_Level - Proficiency level (1: Beginner - 5: Expert).
 * @property {String} HCJ_JSL_Language_Proficiency - Proficiency category (Basic, Intermediate, Advanced).
 * @property {String} HCJ_JSL_Session_Id - Session ID for tracking.
 * @property {Date} HCJ_JSL_Creation_DtTym - Timestamp when the language entry was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JSL_Audit_Trail - Array of audit trail entries.
 * @property {Date} createdAt - Timestamp when the document was created.
 * @property {Date} updatedAt - Timestamp when the document was last updated.
 */

const HCJJobSeekerLanguagesSchema = new mongoose.Schema(
  {
    HCJ_JSL_Source: { 
      type: String, 
      enum: ["01", "02"], // 01: Individual, 02: Job Seeker
      required: true 
    },
    HCJ_JSL_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "HCJ_JSL_Ref", // Dynamic reference based on HCJ_JSL_Source
    },
    HCJ_JSL_Ref: {
      type: String,
      required: true,
      enum: ["IndividualDetails", "JobSeeker"], // Possible referenced collections
    },
    HCJ_JSL_Language: { type: String, required: true },
    HCJ_JSL_Language_Proficiency_Level: {
      type: String, // Kept String since enum values are quoted
      enum: ["01", "02", "03", "04", "05"],
      required: true,
    },
    HCJ_JSL_Language_Proficiency: {
      type: [String],
      enum: ["01", "02", "03"],
      required: true,
    },
    HCJ_JSL_Session_Id: { type: String, required: false },
    HCJ_JSL_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JSL_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

// Middleware to dynamically set reference table before saving
HCJJobSeekerLanguagesSchema.pre("validate", function (next) {
  const sourceToRefMap = {
    "01": "IndividualDetails",
    "02": "JobSeeker",
  };

  this.HCJ_JSL_Ref = sourceToRefMap[this.HCJ_JSL_Source];
  next();
});

const JobSeekerLanguages =
  mongoose.models["hcj_job_seeker_languages"] ||
  mongoose.model("hcj_job_seeker_languages", HCJJobSeekerLanguagesSchema);

export default JobSeekerLanguages;

import mongoose from "mongoose";
import { AuditTrailSchema } from "../common/AuditTrail";

/**
 * Schema for Differently-Abled Job Seeker Details.
 *
 * @typedef {Object} hcj_differently_abledSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_DA_Job_Seeker_Id - Reference to the job seeker.
 * @property {String} HCJ_DA_Disability_Type - Type of disability (as per official dropdown list).
 * @property {String} HCJ_DA_Disability_Percentage - Percentage of disability (e.g., 40%, 60%).
 * @property {String} HCJ_DA_Disability_Id - Optional government-issued disability ID.
 * @property {String} HCJ_DA_Disability_Document - Optional file path or file reference for disability proof.
 * @property {String} HCJ_DA_Accessibility_Needs - Description of specific accessibility needs.
 * @property {Number} HCJ_DA_Session_Id - Session identifier.
 * @property {Date} HCJ_DA_Creation_DtTym - Timestamp for record creation.
 * @property {Array.<AuditTrailSchema>} HCJ_DA_Audit_Trail - Audit trail entries for changes and tracking.
 * @property {Date} createdAt - Mongoose-managed creation timestamp.
 * @property {Date} updatedAt - Mongoose-managed update timestamp.
 */

const hcjDifferentlyAbledSchema = new mongoose.Schema(
  {
    HCJ_DA_Job_Seeker_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hcj_job_seeker",
      required: true,
    },
    HCJ_DA_Disability_Type: {
      type: String,
      required: true,
      enum: [
        "Locomotor Disability Upper Limb",
        "Locomotor Disability Lower Limb",
        "Locomotor Disability Trunk (Spinal Cord)",
        "Deaf and hearing impairment",
        "Blindness",
        "Low Vision",
        "Dwarfism",
        "Cerebral Palsy",
        "Muscular Dystrophy",
        "Leprosy Cured Person",
        "Acid Attack Victim",
        "Multiple Sclerosis",
        "Intellectual Disability",
        "Mental Illness",
        "Autism Spectrum Disorder",
        "Chronic Neurological Condition",
        "Specific Learning Disabilities",
        "Speech & Language Disability",
        "Thalassemia",
        "Hemophilia",
        "Sickle Cell Disease",
        "Multiple Disabilities",
        "Parkinson's Disease"
      ],
    },
    HCJ_DA_Disability_Percentage: {
      type: String,
      required: true,
    },
    HCJ_DA_Disability_Id: {
      type: String,
      default: null,
      trim: true,
    },
    HCJ_DA_Disability_Document: {
      type: String, // Usually a file path or cloud storage URL
      default: null,
    },
    HCJ_DA_Accessibility_Needs: {
      type: String,
      required: true,
    },
    HCJ_DA_Session_Id: {
      type: Number,
      required: true,
    },
    HCJ_DA_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_DA_Audit_Trail: {
      type: [AuditTrailSchema],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.models.hcj_differently_abled ||
  mongoose.model("hcj_differently_abled", hcjDifferentlyAbledSchema);

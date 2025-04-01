import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema definition for HCJ Skills.
 *
 * @typedef {Object} hcjSkillsSchema
 * @property {mongoose.Schema.Types.ObjectId} HCJ_SKT_Skill_Id - The unique ID of the skill record.
 * @property {mongoose.Schema.Types.ObjectId} HCJ_SKT_Individual_Id - The ID of the individual.
 * @property {String} HCJ_SKT_Industry - The industry associated with the skills.
 * @property {String[]} HCJ_SKT_Skills - An array of skills.
 * @property {String} HCJ_SKT_Session_Id - The session ID.
 * @property {Date} HCJ_SKT_Creation_DtTym - The creation date and time (default: current date/time).
 * @property {AuditTrailSchema[]} HCJ_SKT_Audit_Trail - Array of audit trail records.
 * @property {Date} createdAt - Auto-generated timestamp when the document was created.
 * @property {Date} updatedAt - Auto-generated timestamp when the document was last updated.
 */
const hcjSkillsSchema = new mongoose.Schema(
  {
  //  HCJ_SKT_Skill_Id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique Skill Record ID
    HCJ_SKT_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "IndividualDetails",
    }, // Foreign Key (Reference to Individual)
    HCJ_SKT_Industry: { type: String, required: true }, // Industry Name
    HCJ_SKT_Skills: [{ type: String, required: true }], // Skills Array
    HCJ_SKT_Session_Id: { type: String, required: true }, // Session Identifier
    HCJ_SKT_Creation_DtTym: { type: Date, default: Date.now }, // Auto-creation timestamp
    HCJ_SKT_Audit_Trail: [AuditTrailSchema], // Audit Trail for tracking changes
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

// Export the model to avoid re-compiling issues in hot-reloading environments
export default mongoose.models.HCJ_SKILLS ||
  mongoose.model("HCJ_SKILLS", hcjSkillsSchema);



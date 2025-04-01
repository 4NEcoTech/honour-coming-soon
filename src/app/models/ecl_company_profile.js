import mongoose from "mongoose";

/**
 * Schema for Company Profile in EcoLink System.
 *
 * @typedef {Object} CompanyProfileSchema
 * @property {mongoose.Schema.Types.ObjectId} ECL_ECP_EcoLink_Id - Reference to the associated EcoLink entry.
 * @property {mongoose.Schema.Types.ObjectId} ECL_ECP_Company_Id - Unique identifier for the company.
 * @property {String} ECL_ECP_Company_Specialization - The specialization or industry focus of the company.
 * @property {Number} ECL_ECP_Company_Size - Number of employees or students in the company.
 * @property {Number} ECL_ECP_Establishment_Year - Year the company was established.
 * @property {Boolean} ECL_ECP_Institute_Follow_On_HCJ - Flag indicating if the institution is followed on HCJ.
 * @property {Number} ECL_ECP_Session_Id - Identifier for the session during which the record was created.
 * @property {Date} ECL_ECP_Creation_DtTym - Date and time when the record was created.
 * @property {String} ECL_ECP_Audit_Trail - Audit trail information to track changes.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const CompanyProfileSchema = new mongoose.Schema({
//  ECL_ECP_EcoLink_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "EcoLink" },
  ECL_ECP_Company_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "EcoLink" },
  ECL_ECP_Company_Specialization: { type: String, default: "" },
  ECL_ECP_Company_Size: { type: Number, default: 0 }, // Number of employees/students
  ECL_ECP_Establishment_Year: { type: Number, required: true },
  ECL_ECP_Institute_Follow_On_HCJ: { type: Boolean, default: false },
  ECL_ECP_Session_Id: { type: Number, required: true },
  ECL_ECP_Creation_DtTym: { type: Date, default: Date.now },
  ECL_ECP_Audit_Trail: { type: String, required: true }
});

const CompanyProfile =
  mongoose.models["ECL_COMPANY_PROFILE"] ||
  mongoose.model("ECL_COMPANY_PROFILE", CompanyProfileSchema);

export default CompanyProfile;

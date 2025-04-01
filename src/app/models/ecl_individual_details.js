import mongoose from "mongoose";


/**
 * Schema for Individual Details in EcoLink System.
 *
 * @typedef {Object} IndividualDetailsSchema
 * @property {mongoose.Schema.Types.ObjectId} ECL_EID_EcoLink_Id - Primary Key: Reference to the associated EcoLink entry (MongoDB system-generated ID).
 * @property {mongoose.Schema.Types.ObjectId} ECL_EID_Individual_Id - Foreign Key: Can reference an individual, company, or T-shirt ID (MongoDB system-generated ID).
 * @property {String} ECL_EID_Current_Designation - Current designation of the individual (optional, not applicable to companies or T-shirts).
 * @property {String} ECL_EID_Current_Company_Name - Name of the current company where the individual is employed (optional).
 * @property {Number} ECL_EID_Session_Id - Identifier for the session during which the record was created.
 * @property {Date} ECL_EID_Creation_DtTym - Date and time when the record was created (used for tracking data modifications and access).
 * @property {String} ECL_EID_Audit_Trail - Audit trail information for tracking changes (technical team-defined).
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const IndividualDetailsSchema = new mongoose.Schema(
  {
   // ECL_EID_EcoLink_Id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "EcoLink" },
    ECL_EID_Individual_Id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "EcoLink" },
    ECL_EID_Current_Designation: { type: String, default: "" }, // Only applicable to individuals
    ECL_EID_Current_Company_Name: { type: String, default: "" },
    ECL_EID_Session_Id: { type: Number, required: true },
    ECL_EID_Creation_DtTym: { type: Date, default: Date.now },
    ECL_EID_Audit_Trail: { type: String, required: true }
  },
  { timestamps: true }
);

const IndividualDetails =
  mongoose.models["ECL_INDIVIDUAL_DTLS"] ||
  mongoose.model("ECL_INDIVIDUAL_DTLS", IndividualDetailsSchema);

export default IndividualDetails;

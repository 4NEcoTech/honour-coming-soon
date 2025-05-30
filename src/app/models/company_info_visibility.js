import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";

/**
 * Schema for Company Information Visibility Settings.
 *
 * @typedef {Object} company_info_visibilitySchema
 * @property {mongoose.Schema.Types.ObjectId} CIV_Visibility_Id - Unique identifier for the company visibility settings (Auto-generated by MongoDB).
 * @property {mongoose.Schema.Types.ObjectId} CIV_Company_Id - Reference to the company profile (Required).
 * @property {Boolean} CIV_Phone_Number - Set privacy for the company's contact number visibility (Switch: true/false).
 * @property {Boolean} CIV_Email - Set privacy for the company's email visibility (Switch: true/false).
 * @property {Boolean} CIV_Website_URL - Set privacy for the company's website URL visibility (Switch: true/false).
 * @property {Boolean} CIV_Address_Line1 - Set privacy for the company's address line 1 visibility (Switch: true/false).
 * @property {Boolean} CIV_Address_Line2 - Set privacy for the company's address line 2 visibility (Switch: true/false).
 * @property {Boolean} CIV_Landmark - Set privacy for the company's landmark visibility (Switch: true/false).
 * @property {Boolean} CIV_Pincode - Set privacy for the company's pincode visibility (Switch: true/false).
 * @property {Number} CIV_Session_Id - Session identifier where the record was created (Optional).
 * @property {Date} CIV_Creation_DtTym - Date and time when the visibility record was created (Default: Current timestamp).
 * @property {Array.<AuditTrailSchema>} CIV_Audit_Trail - Audit trail information for tracking changes (Optional).
 * @property {Date} createdAt - The timestamp when the document was created (Managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (Managed by Mongoose).
 */

const company_info_visibilitySchema = new mongoose.Schema(
  {
    CIV_Company_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company_details", // Reference to company
      required: true,
    },
    CIV_Phone_Number: { type: Boolean, default: false },
    CIV_Email: { type: Boolean, default: false },
    CIV_Website_URL: { type: Boolean, default: false },
    CIV_Address_Line1: { type: Boolean, default: false },
    CIV_Address_Line2: { type: Boolean, default: false },
    CIV_Landmark: { type: Boolean, default: false },
    CIV_Pincode: { type: Boolean, default: false },
    CIV_Session_Id: { type: Number },
    CIV_Creation_DtTym: { type: Date, default: Date.now },
    CIV_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.company_info_visibility ||
  mongoose.model("company_info_visibility", company_info_visibilitySchema);


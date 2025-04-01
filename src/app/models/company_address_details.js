import mongoose from "mongoose";
import { AuditTrailSchema } from "./common/AuditTrail";


/**
 * Schema for Company Address Details.
 *
 * @typedef {Object} company_address_detailsSchema
 * @property {mongoose.Schema.Types.ObjectId} CAD_Address_Id - Unique identifier for the address.
 * @property {mongoose.Schema.Types.ObjectId} CAD_Company_Id - Reference to the associated company.
 * @property {String} CAD_Address_Type - Type of address (e.g., Registered, Billing, Shipping).
 * @property {String} CAD_Address_Custom_Name - Custom name for the address.
 * @property {String} CAD_Address_Line1 - Primary address line (street address).
 * @property {String} CAD_Address_Line2 - Secondary address line (optional).
 * @property {String} CAD_Landmark - Landmark for easier location identification.
 * @property {String} CAD_City - City where the address is located.
 * @property {String} CAD_State - State where the address is located.
 * @property {String} CAD_Country - Country where the address is located.
 * @property {String} CAD_Pincode - Postal code/ZIP code of the address.
 * @property {Number} CAD_Session_Id - Identifier for the session in which the data was recorded.
 * @property {Date} CAD_Creation_DtTym - Date and time when the address record was created.
 * @property {Array.<AuditTrailSchema>} CAD_Audit_Trail - Audit trail information for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const company_address_detailsSchema = new mongoose.Schema(
  {
   // CAD_Address_Id: { type: mongoose.Schema.Types.ObjectId, auto: true, },
    CAD_Company_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company_details",
      required: true, // Ensure company linkage is mandatory
    },
    CAD_Address_Type: { type: String, required: true }, // Address type is now required
    CAD_Address_Custom_Name: { type: String },
    CAD_Address_Line1: { type: String, required: true },
    CAD_Address_Line2: { type: String },
    CAD_Landmark: { type: String },
    CAD_City: { type: String, required: true },
    CAD_State: { type: String, required: true },
    CAD_Country: { type: String, required: true },
    CAD_Pincode: { type: String, required: true },
    CAD_Session_Id: { type: Number },
    CAD_Creation_DtTym: { type: Date, default: Date.now },
    CAD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

export default mongoose.models.company_address_detail ||
  mongoose.model("company_address_detail", company_address_detailsSchema);

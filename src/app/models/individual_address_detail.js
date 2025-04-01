import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';


/**
 * @typedef {Object} AddressDetailsSchema
 * @property {mongoose.Schema.Types.ObjectId} IAD_Address_Id - Auto-generated unique identifier for the address.
 * @property {mongoose.Schema.Types.ObjectId} IAD_Individual_Id - Foreign key reference to the IndividualDetails schema.
 * @property {String} IAD_Address_Type - Type of address (e.g., Home, Work, Other). Required status to be confirmed after discussion.
 * @property {String} IAD_Address_Custom_Name - Custom name assigned to the address.
 * @property {String} IAD_Address_Line1 - First line of the address (e.g., street name, apartment number). Required.
 * @property {String} IAD_Address_Line2 - Second line of the address (optional).
 * @property {String} IAD_Landmark - Nearby landmark to help locate the address.
 * @property {String} IAD_Phone_Number - Contact phone number associated with the address.
 * @property {String} IAD_City - City name. Required.
 * @property {String} IAD_State - State or province name. Required.
 * @property {String} IAD_Country - Country name. Required.
 * @property {String} IAD_Pincode - Postal code or ZIP code. Required.
 * @property {String} IAD_Session_Id - Session ID to track changes.
 * @property {Date} IAD_Creation_DtTym - Timestamp when the address entry was created.
 * @property {Array.<AuditTrailSchema>} IAD_Audit_Trail - Array of audit trail records for tracking modifications.
 * @property {Date} createdAt - Auto-generated timestamp for document creation.
 * @property {Date} updatedAt - Auto-generated timestamp for last update.
 */

const AddressDetailsSchema = new mongoose.Schema(
  {
  //  IAD_Address_Id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    IAD_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'IndividualDetails', // Reference to IndividualDetails schema
    },
     // 01 Permanent,
      // 02 Communication, 
      // 03 Work/Office, 
      // 04 Others 
      // 05 Preferred Shipping Address  
      // 06 Preferred Billing Address 
      // 07 Shipping Address2 
      // 08 Shipping Address3 
      // 09 Billing Address2 
      // 10 Billing Address3
    IAD_Address_Type: {
      type: String,    
      enum: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      default:"01",
      required: true, // Update to true after discussion
    },
    IAD_Address_Custom_Name: {
      type: String,
      required: false,
    },
    IAD_Address_Line1: {
      type: String,
      required: true, // Mandatory field
    },
    IAD_Address_Line2: {
      type: String,
      required: false,
    },
    IAD_Landmark: {
      type: String,
      required: false,
    },
    IAD_Phone_Number: {
      type: String,
      required: false,
    },
    IAD_City: {
      type: String,
      required: true,
    },
    IAD_State: {
      type: String,
      required: true,
    },
    IAD_Country: {
      type: String,
      required: true,
    },
    IAD_Pincode: {
      type: String,
      required: true,
    },
    IAD_Session_Id: {
      type: String,
      required: false,
    },
    IAD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Ensure schema is not recompiled
const AddressDetails =
  mongoose.models.individual_address_detail || 
  mongoose.model('individual_address_detail', AddressDetailsSchema);

export default AddressDetails;


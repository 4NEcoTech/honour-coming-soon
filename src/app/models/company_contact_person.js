import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * Schema for Company Contact Person.
 *
 * @typedef {Object} company_contact_personSchema
 * @property {mongoose.Schema.Types.ObjectId} CCP_Contact_Person_Id - Unique identifier for the contact person (Auto-generated).
 * @property {mongoose.Schema.Types.ObjectId} CCP_Admin_Invitee_Id - Identifier for the admin invitee (Required).
 * @property {Number} CCP_Contact_PersonNum - Unique number assigned to the contact person (Required).
 * @property {String} CCP_Contact_Person_TheirRef - External reference ID for the contact person (Optional).
 * @property {mongoose.Schema.Types.ObjectId} CCP_Individual_Id - Reference to the individual's details (Optional).
 * @property {mongoose.Schema.Types.ObjectId} CCP_Company_Id - Reference to the company details (Required).
 * @property {String} CCP_Contact_Person_First_Name - First name of the contact person (Required).
 * @property {String} CCP_Contact_Person_Last_Name - Last name of the contact person (Required).
 * @property {String} CCP_Contact_Person_Phone - Primary contact number (Required, 10 digits).
 * @property {String} CCP_Contact_Person_Alternate_Phone - Alternate contact number (Optional, 10 digits).
 * @property {String} CCP_Contact_Person_Email - Primary email of the contact person (Required, Unique).
 * @property {String} CCP_Contact_Person_Alternate_Email - Alternate email of the contact person (Required).
 * @property {String} CCP_Contact_Person_Designation - Designation of the contact person (Optional).
 * @property {String} CCP_Contact_Person_Role - Role assigned to the contact person (Required).
 * @property {Number} CCP_Contact_Person_Joining_Year - Year of joining (Optional, 4 digits).
 * @property {String} CCP_Contact_Person_Department - Department of the contact person (Optional).
 * @property {String} CCP_Contact_Person_Gender - Gender of the contact person (Required).
 * @property {Date} CCP_Contact_Person_Birthdate - Birthdate of the contact person (Required, Format: YYYY-MM-DD).
 * @property {String} CCP_Contact_Person_Country - Country of the contact person (Required).
 * @property {String} CCP_Contact_Person_State - State of the contact person (Required).
 * @property {String} CCP_Contact_Person_Pincode - Pincode (Required, 6 digits).
 * @property {String} CCP_Contact_Person_City - City of the contact person (Required).
 * @property {String} CCP_Contact_Person_Address_Line1 - Address Line 1 (Required).
 * @property {String} CCP_Contact_Person_Document_Domicile - Document domicile (Optional).
 * @property {String} CCP_Contact_Person_Document_Type - Type of document (Optional).
 * @property {String} CCP_Contact_Person_Document_Number - Unique identifier for the document (Optional, Alphanumeric).
 * @property {String} CCP_Contact_Person_Document_Picture - URL of the uploaded document (Optional).
 * @property {Number} CCP_Session_Id - Identifier for the session in which the data was recorded (Required).
 * @property {Date} CCP_Created_DtTym - Date and time when the record was created (Required, Default: Current timestamp).
 * @property {Array.<AuditTrailSchema>} CCP_Audit_Trail - Audit trail information for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created (Managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (Managed by Mongoose).
 */

const companyContactPersonSchema = new mongoose.Schema(
  {
  //  CCP_Contact_Person_Id: { type: mongoose.Schema.Types.ObjectId, auto: true,},
    CCP_Admin_Invitee_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    CCP_Contact_PersonNum: {
      type: String,
      // unique: true,
      // required: true,
    },
    CCP_Institute_Num: {
      type: String,
      required: true,
    },
    CCP_Institute_Name: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_TheirRef: {
      type: String,
    },
    CCP_Individual_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'individual_details',
      required: false, default: null
    },
    CCP_Company_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'company_details',
      required: true,
    },
    CCP_Contact_Person_First_Name: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Last_Name: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Phone: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Alternate_Phone: {
      type: String,
    },
    CCP_Contact_Person_Email: {
      type: String,
      required: true,
      unique: true,
    },
    CCP_Contact_Person_Alternate_Email: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Designation: {
      type: String,
    },

    // 07 Institution Team Member
    // 08 Institution Support
    // 10 Employee Team Member
    // 11 Employee Support

    CCP_Contact_Person_Role: {
      type: String,
      required: true,
      enum:[ '07', '08', '10', '11'],
    },
    CCP_Contact_Person_Joining_Year: {
      type: Number,
    },
    CCP_Contact_Person_Department: {
      type: String,
    },
    CCP_Contact_Person_Gender: {
      type: String,
      required: true,
      enum: ['01', '02', '03'],
    },
    CCP_Contact_Person_DOB: {
      type: Date,
      required: false,
    },
    CCP_Contact_Person_Country: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_State: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Pincode: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_City: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Address_Line1: {
      type: String,
      required: true,
    },
    CCP_Contact_Person_Document_Domicile: {
      type: String,
    },
    CCP_Contact_Person_Document_Type: {
      type: String,
    },
    CCP_Contact_Person_Document_Number: {
      type: String,
    },
    CCP_Contact_Person_Document_Picture: {
      type: String,
    },
    signupToken: { type: String },
    CCP_Session_Id: {
      type: Number,
      required: false,
    },
    CCP_Created_DtTym: {
      type: Date,
      default: Date.now,
      required: true,
    },
    CCP_Audit_Trail: [AuditTrailSchema],
  },
  { timestamps: true }
);

export default mongoose.models.company_contact_person ||
  mongoose.model('company_contact_person', companyContactPersonSchema);

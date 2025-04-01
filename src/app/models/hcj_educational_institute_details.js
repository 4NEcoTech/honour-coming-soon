import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * Schema definition for Educational Institute details in the HCJ system.
 *
 * @typedef {Object} hcjEducationalInstituteDetailsSchema
 * @property {String} HCJ_EID_Institutes_Id - The unique identifier for the educational institute (MongoDB ObjectId).
 * @property {String} HCJ_EID_Institute_Num - The system-generated unique institute number.
 * @property {String} HCJ_EID_Institute_Cover_Profile - The cover profile image URL for the institute.
 * @property {String} HCJ_EID_Institute_Mission - The mission statement of the institute.
 * @property {Array.<String>} HCJ_EID_Institute_Specialization - The list of specializations offered by the institute.
 * @property {Boolean} HCJ_EID_Institute_AICTE_YesNo - Indicates if the institute is AICTE-approved (true/false).
 * @property {String} HCJ_EID_Institute_Type - The type of institute (e.g., "private" or "public").
 * @property {String} HCJ_EID_Institute_About - A brief description or overview of the institute.
 * @property {Number} HCJ_EID_Institute_Established_Year - The year in which the institute was established.
 * @property {String} HCJ_EID_Institute_Approved_By - The authority that has approved the institute.
 * @property {Number} HCJ_EID_Institute_Students - The total number of students enrolled in the institute.
 * @property {String} HCJ_EID_Session_Id - The session ID related to the user's session.
 * @property {Date} HCJ_EID_Creation_DtTym - The timestamp when the document was created.
 * @property {Array.<AuditTrailSchema>} HCJ_EID_Audit_Trail - The audit trail for tracking changes.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjEducationalInstituteDetailsSchema = new mongoose.Schema(
  {
  //  HCJ_EID_Institutes_Id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID from MongoDB
    HCJ_EID_Institute_Num: { type: String, required: true, default: uuidv4 }, // System-generated unique institute number
    HCJ_EID_Institute_Cover_Profile: { type: String, required: false }, // Cover profile image URL
    HCJ_EID_Institute_Mission: { type: String, required: false }, // Mission statement of the institute
    HCJ_EID_Institute_Specialization: { type: [String], required: false }, // Specializations offered
    HCJ_EID_Institute_AICTE_YesNo: { type: Boolean, required: false }, // AICTE approval status (true/false)
    HCJ_EID_Institute_Type: {
      type: String,
      enum: ['private', 'public'],
      required: true,
    }, // Institute type (Private/Public)
    HCJ_EID_Institute_About: { type: String, required: false }, // Institute description
    HCJ_EID_Institute_Established_Year: { type: Number, required: true }, // Year of establishment
    HCJ_EID_Institute_Approved_By: { type: String, required: false }, // Approval authority
    HCJ_EID_Institute_Students: { type: Number, required: false }, // Total number of students
    HCJ_EID_Session_Id: { type: String, required: false }, // Session ID of the user
    HCJ_EID_Audit_Trail: [AuditTrailSchema], // Audit trail for changes
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

export default mongoose.models.HCJ_Educational_Institute_Details ||
  mongoose.model('HCJ_Educational_Institute_Details', hcjEducationalInstituteDetailsSchema);

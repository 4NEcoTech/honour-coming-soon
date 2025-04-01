import mongoose from 'mongoose';
import { AuditTrailSchema } from './common/AuditTrail';

/**
 * Schema definition for Individual Gender Information in the HCJ system.
 *
 * @typedef {Object} hcjIndividualGenderInfoSchema
 * @property {String} HCJ_IGI_Gender_At_Birth - The gender assigned at birth (Enum: '1', '2', '3'). Will be converted to numbers after team discussion.
 * @property {String} HCJ_IGI_Gender_Identity - The gender identity of the individual. Will be required after team discussion. (Enum: '01 Male', '02 Female', '03 Nonbinary', '04 Cisgender', '05 Genderfluid', '06 Male', '07 Female', '08 Transgender', '09 Gender Neutral', '10 Agender', '11 Pangender', '12 Other')
 * @property {String} HCJ_IGI_Pronouns - The pronouns used by the individual (Enum: 'he', 'she', 'they', 'them'). Will be converted to numbers after team discussion.
 * @property {String} HCJ_IGI_Session_Id - The session ID associated with the user's session. Will be required after team discussion.
 * @property {Array.<AuditTrailSchema>} HCJ_IGI_Audit_Trail - The audit trail for tracking changes in records.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjIndividualGenderInfoSchema = new mongoose.Schema(
  {

    //HCJ_IGI_Job_Seeker_Id Primary Key Auto Generated I'd

    HCJ_IGI_Gender_At_Birth: {
      type: String,
      enum: ['1', '2', '3'],
      required: true,
    },

    HCJ_IGI_Gender_Identity: {
      type: String,
      required: false, 
    },

   
    HCJ_IGI_Pronouns: {
      type: String,
      enum: ['he', 'she', 'they', 'them'], 
      required: false, 
    },

 
    HCJ_IGI_Session_Id: {
      type: String,
      required: false, 
    },

   
    HCJ_IGI_Audit_Trail: [AuditTrailSchema], 

  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.HCJ_Individual_Gender_Info ||
  mongoose.model('HCJ_Individual_Gender_Info', hcjIndividualGenderInfoSchema);

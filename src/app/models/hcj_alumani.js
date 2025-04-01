import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Alumni.
 *
 * @typedef {Object} hcjAlumniSchema
 * @property {String} HCJ_AL_Alumni_Id - Unique identifier for the alumni.
 * @property {String} HCJ_AL_AlumniNum - Alumni number.
 * @property {String} HCJ_AL_Individual_Id - Identifier for the individual.
 * @property {String} HCJ_AL_Institute_Id - Identifier for the institute.
 * @property {Number} HCJ_AL_Graduation_Year - Year of graduation.
 * @property {String} HCJ_ST_Class_Of_Year - Class of year for the alumni.
 * @property {String} HCJ_AL_Degree - Degree obtained by the alumni.
 * @property {String} HCJ_AL_Current_Role - Current role of the alumni.
 * @property {String} HCJ_AL_Current_Industry - Current industry of the alumni.
 * @property {String} HCJ_AL_Profile_Details - Profile details of the alumni.
 * @property {String} HCJ_AL_Session_Id - Session identifier.
 * @property {Date} HCJ_AL_Created_DtTym - The timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AL_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjAlumniSchema = new Schema(
  {
//    HCJ_AL_Alumni_Id: { type: String, required: true, unique: true }, // _id
    HCJ_AL_AlumniNum: { type: String, required: true },
    HCJ_AL_Individual_Id: { type: String, required: true },
    HCJ_AL_Institute_Id: { type: String, required: true },
    HCJ_AL_Graduation_Year: { type: Number, required: true },
    HCJ_ST_Class_Of_Year: { type: String },
    HCJ_AL_Degree: { type: String, required: true },
    HCJ_AL_Current_Role: { type: String, required: true },
    HCJ_AL_Current_Industry: { type: String, required: true },
    HCJ_AL_Profile_Details: { type: String, required: true },
    HCJ_AL_Session_Id: { type: String, required: true },
    HCJ_AL_Created_DtTym: { type: Date, default: Date.now },
    HCJ_AL_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJAlumni = mongoose.model('hcj_alumni', hcjAlumniSchema);

module.exports = HCJAlumni;

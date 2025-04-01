import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Job Fair Registration.
 *
 * @typedef {Object} hcjJobFairRegistrationSchema
 * @property {String} HCJ_JFR_Registration_Id - Unique identifier for the job fair registration.
 * @property {Number} HCJ_JFR_RegistrationNum - Registration number for the job fair.
 * @property {String} HCJ_JFR_Jobfair_Id - Identifier for the job fair.
 * @property {String} HCJ_JFR_Individual_Id - Identifier for the individual registering.
 * @property {String} HCJ_JFR_Company_Id - Identifier for the company associated with the registration.
 * @property {Date} HCJ_JFR_Registred_DtTym - Date and time when the registration was made.
 * @property {String} HCJ_JFR_Session_Id - Identifier for the session.
 * @property {Date} HCJ_JFR_Creation_DtTym - Timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_JFR_Audit_Trail - Audit trail information.
 * @property {Date} createdAt - Timestamp indicating when the document was created.
 * @property {Date} updatedAt - Timestamp indicating when the document was last updated.
 */

const hcjJobFairRegistrationSchema = new Schema(
  {
  //  HCJ_JFR_Registration_Id: { type: String }, // _id
    HCJ_JFR_RegistrationNum: { type: Number },
    HCJ_JFR_Jobfair_Id: { type: String },
    HCJ_JFR_Individual_Id: { type: String },
    HCJ_JFR_Company_Id: { type: String },
    HCJ_JFR_Registred_DtTym: { type: Date, default: Date.now },
    HCJ_JFR_Session_Id: { type: String },
    HCJ_JFR_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_JFR_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJJobFairRegistration = mongoose.model(
  'hcj_job_fair_registration',
  hcjJobFairRegistrationSchema
);

module.exports = HCJJobFairRegistration;

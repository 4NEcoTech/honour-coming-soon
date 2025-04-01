import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema definition for HCJ Senior Details.
 *
 * @typedef {Object} hcjSeniorDetailsSchema
 * @property {String} HCJ_SD_Senior_Id - Unique identifier for the senior.
 * @property {String} HCJ_SD_Job_Seeker_Id - The ID of the job seeker.
 * @property {Boolean} HCJ_SD_Flexibility_Required - Indicates if flexibility is required.
 * @property {String} HCJ_SD_Session_Id - The session ID associated with the senior.
 * @property {Date} HCJ_SD_Creation_DtTym - The timestamp when the record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_SD_Audit_Trail - The audit trail information.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjSeniorDetailsSchema = new Schema(
  {
  //  HCJ_SD_Senior_Id: { type: String }, // _id
    HCJ_SD_Job_Seeker_Id: { type: String },
    HCJ_SD_Flexibility_Required: { type: Boolean },
    HCJ_SD_Session_Id: { type: String },
    HCJ_SD_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_SD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJSeniorDetails = mongoose.model(
  'hcj_senior_details',
  hcjSeniorDetailsSchema
);

module.exports = HCJSeniorDetails;

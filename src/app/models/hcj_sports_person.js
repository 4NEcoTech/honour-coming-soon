import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema definition for HCJ Sports Person.
 *
 * @typedef {Object} hcjSportsPersonSchema
 * @property {String} HCJ_SP_Sports_Person_Id - Unique identifier for the sports person.
 * @property {String} HCJ_SP_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_SP_Sport_Played - The sport played by the person.
 * @property {String} HCJ_SP_Sport_Level - The level of the sport played.
 * @property {Boolean} HCJ_SP_Flexibility_Required - Indicates if flexibility is required.
 * @property {String} HCJ_SP_Session_Id - The session ID associated with the sport.
 * @property {String} HCJ_SP_Audit_Trail - The audit trail information.
 * @property {Date} HCJ_SP_Creation_DtTym - The timestamp when the record was created.
 * @property {Date} createdAt - The timestamp when the record was created.
 * @property {Date} updatedAt - The timestamp when the record was last updated.
 */

const hcjSportsPersonSchema = new Schema(
  {
  //  HCJ_SP_Sports_Person_Id: { type: String }, // _id
    HCJ_SP_Job_Seeker_Id: { type: String },
    HCJ_SP_Sport_Played: { type: String },
    HCJ_SP_Sport_Level: { type: String },
    HCJ_SP_Flexibility_Required: { type: Boolean },
    HCJ_SP_Session_Id: { type: String },
    HCJ_SP_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_SP_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hcj_sports_person', hcjSportsPersonSchema);

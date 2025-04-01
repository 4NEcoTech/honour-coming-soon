import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema for HCJ Veterans Details.
 *
 * @typedef {Object} hcjVeteransDetailsSchema
 * @property {String} HCJ_VD_Veteran_Id - Unique identifier for the veteran.
 * @property {String} HCJ_VD_Job_Seeker_Id - The ID of the job seeker.
 * @property {String} HCJ_VD_Service_Area - The service area of the veteran.
 * @property {String} HCJ_VD_ESM_Id - The ESM ID of the veteran.
 * @property {String} HCJ_VD_Service_Description - Description of the service.
 * @property {Number} HCJ_VD_Years_Served - Number of years served.
 * @property {String} HCJ_VD_Rank_Achived - Rank achieved by the veteran.
 * @property {String} HCJ_VD_Session_Id - The session ID.
 * @property {Array.<AuditTrailSchema>} HCJ_VD_Audit_Trail - Array of audit trail entries.
 * @property {Date} HCJ_VD_Creation_DtTym - Timestamp of when the record was created.
 * @property {Date} createdAt - Timestamp of when the record was created.
 * @property {Date} updatedAt - Timestamp of when the record was last updated.
 */

const hcjVeteransDetailsSchema = new Schema(
  {
//  HCJ_VD_Veteran_Id: { type: String }, 
    HCJ_VD_Job_Seeker_Id: { type: String },
    HCJ_VD_Service_Area: { type: String },
    HCJ_VD_ESM_Id: { type: String },
    HCJ_VD_Service_Description: { type: String },
    HCJ_VD_Years_Served: { type: Number },
    HCJ_VD_Rank_Achived: { type: String },
    HCJ_VD_Session_Id: { type: String },
    HCJ_VD_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_VD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hcj_veterans_details', hcjVeteransDetailsSchema);

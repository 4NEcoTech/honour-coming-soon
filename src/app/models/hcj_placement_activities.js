import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Placement Activities.
 *
 * @typedef {Object} hcjPlacementActivitiesSchema
 * @property {String} HCJ_PA_Placement_Id - Unique identifier for the placement record.
 * @property {String} HCJ_PA_Student_Id - The ID of the student associated with the placement.
 * @property {String} HCJ_PA_Institute_Id - The ID of the educational institution.
 * @property {String} HCJ_PA_Company_Id - The ID of the company offering the placement.
 * @property {String} HCJ_PA_Job_Id - The ID of the job position applied for.
 * @property {String} HCJ_PA_Status - The current status of the placement (e.g., Applied, Interviewed, Offered, Accepted).
 * @property {Date} HCJ_PA_Applied_DtTym - The date and time when the student applied for the job.
 * @property {Date} HCJ_PA_Interview_DtTym - The date and time of the interview.
 * @property {Date} HCJ_PA_Offer_DtTym - The date and time when the job offer was made.
 * @property {Date} HCJ_PA_Acceptance_Date - The date when the student accepted the job offer.
 * @property {String} HCJ_PA_Session_Id - The session ID associated with the placement activity.
 * @property {Date} HCJ_PA_Created_At - The timestamp when the placement record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_PA_Audit_Trail - The audit trail information for tracking changes and actions.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjPlacementActivitiesSchema = new Schema(
  {
  //  HCJ_PA_Placement_Id: { type: String }, // _id
    HCJ_PA_Student_Id: { type: String },
    HCJ_PA_Institute_Id: { type: String },
    HCJ_PA_Company_Id: { type: String },
    HCJ_PA_Job_Id: { type: String },
    HCJ_PA_Status: { type: String },
    HCJ_PA_Applied_DtTym: { type: Date },
    HCJ_PA_Interview_DtTym: { type: Date },
    HCJ_PA_Offer_DtTym: { type: Date },
    HCJ_PA_Acceptance_Date: { type: Date },
    HCJ_PA_Session_Id: { type: String },
    HCJ_PA_Created_At: { type: Date, default: Date.now },
    HCJ_PA_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJPlacementActivities = mongoose.model(
  'hcj_placement_activities',
  hcjPlacementActivitiesSchema
);

module.exports = HCJPlacementActivities;

import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema definition for HCJ Group Policy.
 *
 * @typedef {Object} hcjGroupPolicySchema
 * @property {String} HCJ_GP_Policy_ID - Unique identifier for the group policy.
 * @property {String} HCJ_GP_Group_ID - The ID of the group associated with the policy.
 * @property {String} HCJ_GP_Group_Policy - The group policy.
 * @property {String} HCJ_GP_Group_Policy_Response - The response to the group policy.
 * @property {Boolean} HCJ_GP_Group_Policy_Autocheck - Indicates if the group policy is auto-checked.
 * @property {String} HCJ_GP_Group_Policy_Created_By - The creator of the group policy.
 * @property {Date} HCJ_GP_Group_Policy_Date - The date the group policy was created.
 * @property {String} HCJ_GP_Session_Id - The session ID associated with the group policy.
 * @property {Date} HCJ_GP_Creation_DtTym - The timestamp when the document was created.
 * @property {AuditTrailSchema[]} HCJ_GP_Audit_Trail - The audit trail for the group policy.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjGroupPolicySchema = new Schema(
  {
  //  HCJ_GP_Policy_ID: { type: String }, // _id
    HCJ_GP_Group_ID: { type: String },
    HCJ_GP_Group_Policy: { type: String },
    HCJ_GP_Group_Policy_Response: { type: String },
    HCJ_GP_Group_Policy_Autocheck: { type: Boolean },
    HCJ_GP_Group_Policy_Created_By: { type: String },
    HCJ_GP_Group_Policy_Date: { type: Date },
    HCJ_GP_Session_Id: { type: String },
    HCJ_GP_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_GP_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hcj_group_policy', hcjGroupPolicySchema);

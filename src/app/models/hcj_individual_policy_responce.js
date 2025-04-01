import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Individual Policy Response.
 *
 * @typedef {Object} hcjIndividualPolicyResponseSchema
 * @property {String} HCJ_IPR_Policy_Response_ID - The ID of the policy response.
 * @property {String} HCJ_IPR_Policy_ID - The ID of the policy.
 * @property {String} HCJ_IPR_Group_ID - The ID of the group.
 * @property {String} HCJ_IPR_Individual_Group_Policy_Response - The response to the group policy.
 * @property {String} HCJ_IPR_Individual_Group_Policy_Responsded_By - The user who responded to the group policy.
 * @property {Date} HCJ_IPR_Individual_Group_Policy_Date - The date when the group policy was responded to.
 * @property {String} HCJ_IPR_Session_Id - The session ID associated with the group policy.
 * @property {Date} HCJ_IPR_Creation_DtTym - The timestamp when the document was created.
 * @property {AuditTrailSchema[]} HCJ_IPR_Audit_Trail - The audit trail for the group policy.
 * @property {Date} createdAt - The timestamp when the document was created.
 * @property {Date} updatedAt - The timestamp when the document was last updated.
 */

const hcjIndividualPolicyResponseSchema = new Schema(
  {
  //  HCJ_IPR_Policy_Response_ID: {  type: String,  },
    HCJ_IPR_Policy_ID: {
      type: String,
    },
    HCJ_IPR_Group_ID: {
      type: String,
    },
    HCJ_IPR_Individual_Group_Policy_Response: {
      type: String,
    },
    HCJ_IPR_Individual_Group_Policy_Responsded_By: {
      type: String,
    },
    HCJ_IPR_Individual_Group_Policy_Date: {
      type: Date,
    },
    HCJ_IPR_Session_Id: {
      type: String,
    },
    HCJ_IPR_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_IPR_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'hcj_individual_policy_response',
  hcjIndividualPolicyResponseSchema
);

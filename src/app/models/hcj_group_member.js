import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;


/**
 * Schema definition for HCJ Group Member.
 *
 * @typedef {Object} HcjGroupMemberSchema
 * @property {String} HCJ_GM_Group_Member_Id - The unique identifier for the group member.
 * @property {String} HCJ_GM_Group_Id - The unique identifier for the group.
 * @property {String} HCJ_GM_Group_Membership_Type - The type of membership the group member has.
 * @property {String} HCJ_GM_Group_Membership_Status - The status of the group membership.
 * @property {Date} HCJ_GM_Group_Membership_Date - The date when the group membership was created.
 * @property {String} HCJ_GM_Session_Id - The session identifier associated with the group member.
 * @property {AuditTrailSchema[]} HCJ_GM_Audit_Trail - The audit trail information for the group member.
 * @property {Date} HCJ_GM_Creation_DtTym - The timestamp when the record was created.
 * @property {Date} createdAt - The timestamp when the record was created.
 * @property {Date} updatedAt - The timestamp when the record was last updated.
 */

const hcjGroupMemberSchema = new Schema(
  {
  //  HCJ_GM_Group_Member_Id: {  type: String,},
    HCJ_GM_Group_Id: {
      type: String,
    },
    HCJ_GM_Group_Membership_Type: {
      type: String,
    },
    HCJ_GM_Group_Membership_Status: {
      type: String,
    },
    HCJ_GM_Group_Membership_Date: {
      type: Date,
    },
    HCJ_GM_Session_Id: {
      type: String,
    },
    HCJ_GM_Creation_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_GM_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('hcj_group_member', hcjGroupMemberSchema);

import mongoose from 'mongoose';
const { AuditTrailSchema } = require('./common/AuditTrail');
const Schema = mongoose.Schema;

/**
 * Schema for HCJ Group Details.
 *
 * @typedef {Object} HcjGroupDetails
 * @property {string} HCJ_GD_Group_Id - Unique identifier for the group.
 * @property {string} HCJ_GD_Group_Name - The name of the group.
 * @property {string} HCJ_GD_Group_Description - The description of the group.
 * @property {string} HCJ_GD_Group_Created_By - The user who created the group.
 * @property {string} HCJ_GD_Group_Admin_Name - The name of the group admin.
 * @property {string} HCJ_GD_Group_Admin_Contact_Info - The contact information of the group admin.
 * @property {string[]} HCJ_GD_Group_Members - The members of the group.
 * @property {string} HCJ_GD_Group_Status - The status of the group.
 * @property {boolean} HCJ_GD_Join_Group - Indicates if the group is joinable.
 * @property {string} HCJ_GD_Group_Visibility - The visibility of the group.
 * @property {Date} HCJ_GD_Group_Created_DtTym - The date when the group was created.
 * @property {string} HCJ_GD_Session_Id - The session ID associated with the group.
 * @property {string} HCJ_GD_Group_Updated_By - The user who last updated the group.
 * @property {AuditTrailSchema[]} HCJ_GD_Audit_Trail - The audit trail for the group.
 * @property {Date} createdAt - The date when the group was created.
 * @property {Date} updatedAt - The date when the group was last updated.
 */

const hcjGroupDetailsSchema = new Schema(
  {
  //  HCJ_GD_Group_Id: {  type: String,  required: true,   unique: true,},
    HCJ_GD_Group_Name: {
      type: String,
    },
    HCJ_GD_Group_Description: {
      type: String,
    },
    HCJ_GD_Group_Created_By: {
      type: String,
    },
    HCJ_GD_Group_Admin_Name: {
      type: String,
    },
    HCJ_GD_Group_Admin_Contact_Info: {
      type: String,
    },
    HCJ_GD_Group_Members: {
      type: [String],
    },
    HCJ_GD_Group_Status: {
      type: String,
    },
    HCJ_GD_Join_Group: {
      type: Boolean,
    },
    HCJ_GD_Group_Visibility: {
      type: String,
    },
    HCJ_GD_Group_Created_DtTym: {
      type: Date,
      default: Date.now,
    },
    HCJ_GD_Session_Id: {
      type: String,
    },
    HCJ_GD_Group_Updated_By: {
      type: String,
    },
    HCJ_GD_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const hcj_group_details = mongoose.model(
  'hcj_group_details',
  hcjGroupDetailsSchema
);

module.exports = hcj_group_details;

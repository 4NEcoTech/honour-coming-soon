import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema for HCJ Company Role Action.
 *
 * @typedef {Object} hcjCompanyRoleActionSchema
 * @property {String} HCJ_CRA_Role_Id - The ID of the role.
 * @property {String} HCJ_CRA_Company_Id - The ID of the company.
 * @property {String} HCJ_CRA_Role - The role name.
 * @property {String[]} HCJ_CRA_Permissions - The permissions associated with the role.
 * @property {Date} HCJ_CRA_Role_Creation_DtTym - The date and time when the role was created.
 * @property {Date} HCJ_CRA_Updation_DtTym - The date and time when the role was last updated.
 * @property {String} HCJ_CRA_Action_Type - The type of action performed.
 * @property {String} HCJ_CRA_Action_Id - The ID of the action.
 * @property {Date} HCJ_CRA_Action_DtTym - The date and time when the action was performed.
 * @property {String} HCJ_CRA_Session_Id - The session ID associated with the action.
 * @property {Date} HCJ_CRA_Prfl_Creation_DtTym - The date and time when the profile was created.
 * @property {Array.<AuditTrailSchema>} HCJ_CRA_Audit_Trail - The audit trail information.
 * @property {Date} createdAt - Timestamp indicating when the document was created.
 * @property {Date} updatedAt - Timestamp indicating when the document was last updated.
 */

const hcjCompanyRoleActionSchema = new Schema(
  {
//    HCJ_CRA_Role_Id: { type: String, required: true }, // _id
    HCJ_CRA_Company_Id: { type: String, required: true },
    HCJ_CRA_Role: { type: String, required: true },
    HCJ_CRA_Permissions: { type: [String], required: true },
    HCJ_CRA_Role_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_CRA_Updation_DtTym: { type: Date, default: Date.now },
    HCJ_CRA_Action_Type: { type: String, required: true },
    HCJ_CRA_Action_Id: { type: String, required: true },
    HCJ_CRA_Action_DtTym: { type: Date, default: Date.now },
    HCJ_CRA_Session_Id: { type: String, required: true },
    HCJ_CRA_Prfl_Creation_DtTym: { type: Date, default: Date.now },
    HCJ_CRA_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HCJCompanyRoleAction =
  mongoose.models.hcj_company_roles_actions ||
  mongoose.model('hcj_company_roles_actions', hcjCompanyRoleActionSchema);

export default HCJCompanyRoleAction;

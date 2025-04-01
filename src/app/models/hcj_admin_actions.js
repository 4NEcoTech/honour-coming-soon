import mongoose from 'mongoose';
import { AuditTrailSchema } from '../common/AuditTrail';

const Schema = mongoose.Schema;

/**
 * Schema definition for HCJ Admin Actions.
 *
 * @typedef {Object} HcjAdminActionsSchema
 * @property {String} HCJ_AA_Action_Id - The unique ID of the admin action.
 * @property {String} HCJ_AA_Admin_Id - The ID of the admin who performed the action.
 * @property {String} HCJ_AA_Action_Type - The type of action performed.
 * @property {Date} HCJ_AA_Action_DtTym - The date and time when the action was performed.
 * @property {String} HCJ_AA_Session_Id - The session ID associated with the action.
 * @property {Date} HCJ_AA_Creation_DtTym - The date and time when the action record was created.
 * @property {Array.<AuditTrailSchema>} HCJ_AA_Audit_Trail - The audit trail of the admin's actions.
 * @property {Date} createdAt - The timestamp when the document was created (managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the document was last updated (managed by Mongoose).
 */

const hcjAdminActionsSchema = new Schema(
  {
  //  HCJ_AA_Action_Id: { type: String, required: true, unique: true },
    HCJ_AA_Admin_Id: { type: String, required: true },
    HCJ_AA_Action_Type: { type: String, required: true },
    HCJ_AA_Action_DtTym: { type: Date, required: true, default: Date.now },
    HCJ_AA_Session_Id: { type: String, required: true },
    HCJ_AA_Creation_DtTym: { type: Date, required: true, default: Date.now },
    HCJ_AA_Audit_Trail: [AuditTrailSchema],
  },
  {
    timestamps: true,
  }
);

const HcjAdminActions =
  mongoose.models.hcj_admin_actions ||
  mongoose.model('hcj_admin_actions', hcjAdminActionsSchema);

export default HcjAdminActions;
